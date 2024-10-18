import { getLocalStorageValue } from '@Utils';
import qs from 'qs';
import API, { PROJECT_KEY, TOKEN_KEY } from './APIUtils';

function getPage(page: number, pageSize: number) {
    return `page=${page || 0}&pageSize=${pageSize || 20}`;
}

function getTokenStr() {
    return getLocalStorageValue(TOKEN_KEY);
}

function getAppIDStr() {
    const project: G.Project = JSON.parse(getLocalStorageValue(PROJECT_KEY));
    return `appId=${project.appId}`;
}

function getAppIDObj() {
    const project: G.Project = JSON.parse(getLocalStorageValue(PROJECT_KEY));
    return {
        appId: project.appId
    };
}

function getInfoStr(obj: any) {
    let str = '';
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            str += `&${key}=${obj[key]}`;
        }
    }
    return str;
}

function getTokenObj() {
    const str = getTokenStr();
    const strArr = str.split('&');
    const formatObj = {};
    strArr.forEach((item: any) => {
        const keyValueArr = item.split('=');
        formatObj[keyValueArr[0]] = keyValueArr[1];
    });
    return formatObj;
}

//请求小程序列表
export function getProjectList() {
    return API.get(`/base/app/list?${getPage(1, 60)}&${getTokenStr()}`);
}

//请求经营类目列表
export function getCategoryList() {
    return API.get(`http://mp.bz.mgtv.com/base/app/categoryList`);
}

//创建编辑小程序信息
export function updateProjectInfo(info: any) {
    return API.post(`http://mp.bz.mgtv.com/base/app/edit`, qs.stringify({
        ...getTokenObj(),
        ...info
    }));
}

//创建身份认证信息
export function saveAuthInfo(info: any) {
    return API.post(`http://mp.bz.mgtv.com/base/cert/add`, qs.stringify({
        ...getTokenObj(),
        ...info
    }));
}

//请求版本列表
export function getVersionList() {
    return API.get(`http://mp.bz.mgtv.com/develop/version/list?${getPage(1, 60)}&${getTokenStr()}&${getAppIDStr()}`);
}

//请求开发设置数据
export function getDevSettings() {
    return API.get(`http://mp.bz.mgtv.com/develop/config/info?${getTokenStr()}&${getAppIDStr()}`);
}

//重置AppSecret
export function getAppSecret() {
    return API.get(`http://mp.bz.mgtv.com/develop/config/secret/create?${getTokenStr()}&${getAppIDStr()}`);
}

//添加域名白名单
export function addDomain(info: any) {
    return API.post(`http://mp.bz.mgtv.com/develop/config/domain/bind`, qs.stringify({
        ...getTokenObj(),
        ...info
    }));
}

//删除域名白名单
export function deleteDomain(info: any) {
    return API.post(`http://mp.bz.mgtv.com/develop/config/domain/delete`, qs.stringify({
        ...getTokenObj(),
        ...info
    }));
}

//上传代码
export function uploadCode(info: any) {
    return API.post(`http://mp.bz.mgtv.com/develop/version/edit`, qs.stringify({
        ...getTokenObj(),
        ...info
    }));
}

//提交审核
export function submitCheck(id: any) {
    return API.get(`http://mp.bz.mgtv.com/develop/version/commit?${getTokenStr()}&${getAppIDStr()}&id=${id}`);
}

//撤销审核
export function cancelCheck(id: any) {
    return API.get(`http://mp.bz.mgtv.com//develop/version/back?${getTokenStr()}&${getAppIDStr()}&id=${id}`);
}

//身份审核
export function authCheck(info: any) {
    return API.post(`http://mp.bz.mgtv.com/backstage/user/cert/audit`, qs.stringify({
        ...getTokenObj(),
        ...info
    }));
}

//获取身份审核列表
export function getAuthCheckList(info: any) {
    return API.get(`http://mp.bz.mgtv.com/backstage/user/cert/getList?${getTokenStr()}&${getAppIDStr()}${getInfoStr(info)}`);
}

//基本信息审核
export function basicCheck(info: any) {
    return API.post(`http://mp.bz.mgtv.com/backstage/user/app/audit`, qs.stringify({
        ...getTokenObj(),
        ...info
    }));
}

//获取基本信息审核
export function getBasicCheckList(info: any) {
    return API.get(`http://mp.bz.mgtv.com/backstage/user/app/getList?${getTokenStr()}&${getAppIDStr()}${getInfoStr(info)}`);
}

//下线
export function offline(id: any) {
    return API.get(`http://mp.bz.mgtv.com/develop/version/offline?${getTokenStr()}&${getAppIDStr()}&id=${id}`);
}

//上线
export function online(id: any) {
    return API.get(`http://mp.bz.mgtv.com/develop/version/online?${getTokenStr()}&${getAppIDStr()}&id=${id}`);
}

//发布审核
export function publishCheck(info: any) {
    return API.post(`http://mp.bz.mgtv.com/backstage/app/version/audit`, qs.stringify({
        ...getTokenObj(),
        ...info
    }));
}

//获取发布审核信息
export function getPublishCheckList(info: any) {
    return API.get(`http://mp.bz.mgtv.com/backstage/app/version/getList?${getTokenStr()}&${getAppIDStr()}${getInfoStr(info)}`);
}

//获取用户角色信息
export function getRoleInfo(tokenValue: string) {
    return API.get(`http://mp.bz.mgtv.com/base/user/info?${tokenValue}`);
}

//获取认证详情
export function getAuthInfo() {
    return API.get(`http://mp.bz.mgtv.com/backstage/user/cert/info?${getTokenStr()}`);
}

//添加/修改协同者
export function editDeveloper(info: any) {
    return API.post(`http://mp.bz.mgtv.com/develop/member/edit`, qs.stringify({
        ...getTokenObj(),
        ...getAppIDObj(),
        ...info
    }));
}

//删除协同者
export function deleteDeveloper(info: any) {
    return API.post(`http://mp.bz.mgtv.com/develop/member/delete`, qs.stringify({
        ...getTokenObj(),
        ...getAppIDObj(),
        ...info
    }));
}

//获取Framework列表
export function getFrameworkList(info: any) {
    return API.get(`http://mp.bz.mgtv.com/backstage/framework/getList?${getTokenStr()}&${getInfoStr(info)}`);
}
//添加/修改Framework
export function editFramework(info: any) {
    return API.post(`http://mp.bz.mgtv.com/backstage/framework/edit`, qs.stringify({
        ...getTokenObj(),
        ...info
    }));
}

//获取开发者工具
export function getDevToolList(info: any) {
    return API.get(`http://mp.bz.mgtv.com/backstage/devtool/getList?${getTokenStr()}&${getInfoStr(info)}`);
}
//添加/修改开发者工具
export function editDevTool(info: any) {
    return API.post(`http://mp.bz.mgtv.com/backstage/devtool/edit`, qs.stringify({
        ...getTokenObj(),
        ...info
    }));
}

