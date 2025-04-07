export const hasAccess = (accessId: string): boolean => {
    if (typeof window === "undefined") return false;
    
    const rawData = localStorage.getItem("currentRoleAccess");
    if (!rawData) return false;
  
    const currentAccess = JSON.parse(rawData);
    return currentAccess.some((access: any) => access.accessId === accessId);
};

export const hasRootAccess = (): boolean => {
    if (typeof window === "undefined") return false;

    const role = localStorage.getItem(`${process.env.API_URL}_role`);

    return role === process.env.ROLE_ROOT_ID ? true : false
}

interface AccessControlProps {
    accessId: string;
    children: React.ReactNode;
}
  
export const AccessControl: React.FC<AccessControlProps> = ({ accessId, children }) => {
    return hasAccess(accessId) ? <>{children}</> : null;
};
  