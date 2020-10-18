import { useRecoilValue } from "recoil";
import { Tweet } from "../interfaces";

import { twitterState } from "./state";

interface ITwitterNotification {
  notification: Tweet | null;
}

export const useTwitterNotification = (): ITwitterNotification => {
  const notification = useRecoilValue<Tweet | null>(twitterState.notification);
  return { notification };
};
