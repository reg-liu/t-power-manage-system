namespace G {
    interface ILogInfo {
        module: string,
        message: string
    }
    interface IMenuInfo {
        name: string;
        path: string;
    }
    interface User {
        nickname: string;
        mobile: string;
        ticket: string;
        username: string;
        uuid: number;
        avatar: any;
        isCert: number;
        certId: number;
        isAdmin: boolean;
    }
    interface Project {
        appId: string;
        hasAppsecret: number;
        isOwnner: number;
        name: string;
        image: string;
        status: number;
        detail: string;
        schema: string;
        categoryIds: any[];
    }
}