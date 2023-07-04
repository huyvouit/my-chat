import Script from "next/script";
import { OneSignalAppId } from "utils/contants";

const OneSignal: React.FC = () => (
  <>
    <Script id="onesignal-sdk" src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" onLoad={initOneSignal} />
  </>
);

const initOneSignal = () => {
  const onesignal = (window as any).OneSignal;
  if (!onesignal) {
    console.warn("OneSignal SDK not loaded.");
    return;
  }
  onesignal.init({
    appId: OneSignalAppId,
    allowLocalhostAsSecureOrigin: true,
    promptOptions: {
      slidedown: {
        prompts: [
          {
            type: "push",
            autoPrompt: true,
            text: {
              actionMessage: "Would you like to get notifications?",
              acceptButton: "Agree",
              cancelButton: "Not now"
            },
            delay: {
              pageViews: 1,
              timeDelay: 20
            }
          }
        ]
      }
    }
  });
};

export default OneSignal;