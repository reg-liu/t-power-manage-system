import API, { PROJECT_KEY, TICKET_KEY, TOKEN_KEY, USER_KEY } from './APIUtils';
import { getLocalStorageValue, setLocalStorage, SignTool } from '@Utils';
import axios, { setTicket } from './APIUtils';
import { getProjectList, getRoleInfo } from './BaseAPI';
import { navigate } from '@reach/router';
import { message } from 'antd';

const NUC_HOST = 'https://nuc.api.mgtv.com';

const getSign = (mobile: string, invoker: string, operation: string) => {
    let sign;
    sign = SignTool.sign({
        invoker,
        mobile,
        operation,
    });
    return sign;
};

//获取登录二维码
export function getQrcodeUrl() {
    return axios({
        method: 'get',
        url: `GetMultiPic?invoker=aaa&t=${Math.round(new Date().getTime() / 100)}`,
        baseURL: NUC_HOST
    });
}

//查询二维码结果
export function getQrcodeResult(rcode: any) {
    return axios({
        method: 'get',
        url: `GetQrcodeResult?invoker=aaa&t=${Math.round(new Date().getTime() / 100)}&rcode=${rcode}`,
        baseURL: NUC_HOST
    });
}

// 发送短信验证码
export function sendSMSCode(mobile) {
    const sign = getSign(mobile, 'mgmp', 'mobilecodelogin');
    return axios({
        method: 'get',
        url: `GetMobileCode?invoker=mgmp&operation=mobilecodelogin&mobile=${mobile}&smscode=86&sign=${sign}`,
        baseURL: `${NUC_HOST}/v3`
    });
}
// 手机短信登录
export function login(mobile, vcode) {
    return axios({
        method: 'get',
        url: `MobileCodeLogin?invoker=mgmp&smscode=86&mobile=${mobile}&mobilecode=${vcode}`,
        baseURL: NUC_HOST
    });
}

//获取当前用户详细信息
export function getCurrentUser(ticket) {
    return axios({
        method: 'get',
        url: `GetUserInfo?invoker=mgmp&ticket=${ticket}`,
        baseURL: NUC_HOST
    });
}

export function doLogout(dispatch: any) {
    setLocalStorage(TICKET_KEY, '');
    setLocalStorage(TOKEN_KEY, '');
    setLocalStorage(USER_KEY, '');
    dispatch({ type: 'LOAD_USER', user: null });
    dispatch({ type: 'SET_PROJECT', project: null });
    dispatch({ type: 'SET_PROJECTS', projects: null });
    navigate('/home');
    location.reload();
}


//处理登陆响应数据
export async function handleUserResponse(user: G.User, dispatch: any) {
    const { ticket, uuid } = user;
    let response;
    user.avatar = JSON.parse(user.avatar);
    const tokenValue = `ticket=${ticket}&uuid=${uuid}`;
    response = await getRoleInfo(tokenValue);
    if (response.data.code !== 200) {
        message.error(`${response.data.msg}`);
        return;
    }
    const detailUserInfo = response.data.data;
    user.isAdmin = detailUserInfo.roleId === 1;
    user.isCert = detailUserInfo.isCert;
    user.certId = detailUserInfo.certId;
    setLocalStorage(TICKET_KEY, ticket);
    setLocalStorage(TOKEN_KEY, tokenValue);
    setLocalStorage(USER_KEY, JSON.stringify(user));
    dispatch({ type: 'LOAD_USER', user });
    setTicket(ticket);

    response = await getProjectList();
    const { list } = response.data.data;
    const formatList = list.map((project: any) => {
        return {
            ...project,
            categoryIds: []
        };
    });
    dispatch({ type: 'SET_PROJECTS', projects: formatList });
    const projectStr = getLocalStorageValue(PROJECT_KEY);
    if (projectStr) dispatch({ type: 'SET_PROJECT', project: JSON.parse(projectStr) });

    if (location.pathname === '/home' || location.pathname === '/') {
        navigate(list.length ? '/project-list' : '/create-guide');
    } else {
        navigate(location.pathname);
    }
}
