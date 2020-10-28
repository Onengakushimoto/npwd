import { useRecoilValue } from "recoil";
import { phoneState } from "./state";
import { ServerConfig } from "../../../common/interfaces/config";

interface IUsePhone {
  visibility: boolean;
  config?: ServerConfig;
}

export const usePhone = (): IUsePhone => {
  const visibility = useRecoilValue(phoneState.visibility);
  const config = useRecoilValue(phoneState.phoneConfig);
  return { visibility, config };
};
