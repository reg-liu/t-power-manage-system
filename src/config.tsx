export const HeaderMenus = [
  {
    name: '登录',
  },
];

export const ProjectDeveloping = 0;
export const ProjectUploaded = 1;
export const ProjectBasicReviewing = 2;
export const ProjectBasicReviewFail = 3;
export const ProjectBasicReviewSuccess = 4;
export const ProjectPublishReviewing = 5;
export const ProjectOnline = 6;
export const ProjectPublishFail = 7;

export const ProjectStatus = {
  0: {
    name: '开发中',
    class: 'gray',
  },
  1: {
    name: '已上传',
    class: 'green',
  },
  2: {
    name: '审核中',
    class: 'orange',
  },
  3: {
    name: '审核失败',
    class: 'red',
  },
  4: {
    name: '审核通过',
    class: 'green',
  },
  5: {
    name: '审核中',
    class: 'orange',
  },
  6: {
    name: '已上线',
    class: 'green',
  },
  7: {
    name: '审核失败',
    class: 'red',
  },
};

export const CertTypePerson = 1;
export const CertTypeEnterprise = 2;

export const Menus = [
  {
    name: '总览',
    limit: 'all',
    path: '/overview',
  },
  {
    name: '开发管理',
    path: '/develop',
    limit: 'develop',
    children: [
      {
        name: '团队协作',
        limit: 'develop',
        path: '/develop/group',
      },
      {
        name: '版本管理',
        limit: 'develop',
        path: '/develop/version-manage',
      },
    ],
  },
  {
    name: '设置',
    path: '/setting',
    limit: 'setting',
    children: [
      {
        name: '基本设置',
        limit: 'setting',
        path: '/setting/basic',
      },
      {
        name: '开发设置',
        limit: 'setting',
        path: '/setting/dev-setting',
      },
    ],
  },
  {
    name: '审核',
    path: '/check',
    limit: 'admin',
    children: [
      {
        name: '身份审核',
        limit: 'admin',
        path: '/check/auth',
      },
      {
        name: '发布审核',
        limit: 'admin',
        path: '/check/publish',
      },
    ],
  },
  {
    name: '文件管理',
    path: '/file',
    limit: 'admin',
    children: [
      {
        name: 'Framwork管理',
        limit: 'admin',
        path: '/file/framework',
      },
      {
        name: '开发者工具管理',
        limit: 'admin',
        path: '/file/dev-tool',
      },
    ],
  },
];

const formatLeafNodeInfo = (
  item: any,
  allowedPaths: string[],
  filters: string[]
) => {
  if (item.children) {
    const formatNodes = [];
    item.children.forEach((item: any) => {
      const child = formatLeafNodeInfo(item, allowedPaths, filters);
      if (child) formatNodes.push(child);
    });
    item.children = formatNodes;
    if (!filters.includes(item.limit)) {
      return item;
    }
    return null;
  } else {
    if (!filters.includes(item.limit)) {
      allowedPaths.push(item.path);
      return item;
    }
    return null;
  }
};

export const filterMenus = (menus: any, filters: string[]) => {
  const allowedPaths = ['/auth'];
  const formatMenus = [];
  menus.forEach((item: any) => {
    const node = formatLeafNodeInfo(item, allowedPaths, filters);
    if (node) formatMenus.push(node);
  });
  return [formatMenus, allowedPaths];
};
