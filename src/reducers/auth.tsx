export type AuthAction =
  | {
      type: 'LOGIN';
    }
  | {
      type: 'LOAD_USER';
      user: G.User;
    }
  | {
      type: 'SET_PROJECTS';
      projects: G.Project[];
    }
  | {
      type: 'SET_PROJECT';
      project: G.Project;
    };

export interface AuthState {
  isAuthenticated: boolean;
  user: G.User | null;
  projects: G.Project[];
  project: G.Project | null;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  projects: [],
  project: null,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN': {
      //登陆成功后设置状态为认证成功
      return { ...state, isAuthenticated: true };
    }
    case 'LOAD_USER': {
      //根据登陆响应token等参数请求用户详细信息并保持
      return { ...state, user: action.user };
    }
    case 'SET_PROJECTS': {
      return { ...state, projects: action.projects };
    }
    case 'SET_PROJECT': {
      return { ...state, project: action.project };
    }
    default:
      return state;
  }
}
