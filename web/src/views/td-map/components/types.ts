export type ToolbarItem = {
  icon: string;
  title: string;
  name: string;
  size?:number;
  selected?: Boolean;
  groupName?: string;
};
export type S3mModels = {
  name: string;
  thumbnail: string;
  path: string;
  active: boolean;
};

export interface MenuProps {
  key: string;
  title: string;
}
