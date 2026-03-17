import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Bell, BellOff, Loader2, CheckCircle, MoonStar } from "lucide-react";
import { useTranslation } from "react-i18next";

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}

export default function NotificationSettings() {
  const { t } = useTranslation();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const { data: vapidData } = trpc.push.getVapidPublicKey.useQuery();
  const { data: prefs, refetch } = trpc.push.getPreferences.useQuery();

  const subscribe = trpc.push.subscribe.useMutation({
    onSuccess: () => {
      toast.success(t("notifications.enabledTitle"), {
        description: t("notifications.enabledDesc"),
      });
      refetch();
      setIsSubscribing(false);
    },
    onError: (err) => {
      toast.error(t("notifications.enableError") + ": " + err.message);
      setIsSubscribing(false);
    },
  });

  const unsubscribe = trpc.push.unsubscribe.useMutation({
    onSuccess: () => {
      toast.info(t("notifications.disabled"));
      refetch();
    },
  });

  const updatePrefs = trpc.push.updatePreferences.useMutation({
    onSuccess: () => {
      toast.success(t("notifications.prefsSaved"));
      refetch();
    },
  });

  const sendTest = trpc.push.sendTest.useMutation({
    onSuccess: (data) => {
      if (data.sent) {
        toast.success(t("notifications.testSent"));
      } else {
        toast.error(t("notifications.testFailed"));
      }
    },
  });

  useEffect(() => {
    const supported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    setIsSupported(supported);
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleEnable = async () => {
    if (!vapidData?.publicKey) {
      toast.error(t("notifications.notConfigured"));
      return;
    }

    setIsSubscribing(true);

    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        toast.error(t("notifications.permissionDenied"));
        setIsSubscribing(false);
        return;
      }

      const registration = await navigator.serviceWorker.register("/service-worker.js");
      await navigator.serviceWorker.ready;

      const pushSub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidData.publicKey),
      });

      const json = pushSub.toJSON();
      const keys = json.keys as { p256dh: string; auth: string };

      await subscribe.mutateAsync({
        endpoint: pushSub.endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      });
    } catch (err) {
      console.error("Push subscription error:", err);
      toast.error(t("notifications.enableError"));
      setIsSubscribing(false);
    }
  };

  const handleDisable = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const pushSub = await registration.pushManager.getSubscription();
        if (pushSub) await pushSub.unsubscribe();
      }
    } catch {
      // ignore
    }
    unsubscribe.mutate();
  };

  if (!isSupported) {
    return (
      <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-sm text-yellow-400">
        {t("notifications.notSupported")}
      </div>
    );
  }

  const isEnabled = !!prefs;

  return (
    <div className="space-y-4">
      {/* Enable/Disable toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3">
          {isEnabled ? (
            <Bell className="w-5 h-5 text-amber-400" />
          ) : (
            <BellOff className="w-5 h-5 text-muted-foreground" />
          )}
          <div>
            <div className="font-semibold text-foreground text-sm">
              {t("notifications.pushTitle")}
            </div>
            <div className="text-xs text-muted-foreground">
              {isEnabled
                ? t("notifications.activeDesc")
                : permission === "denied"
                  ? t("notifications.blockedDesc")
                  : t("notifications.inactiveDesc")}
            </div>
          </div>
        </div>
        {isEnabled ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisable}
            disabled={unsubscribe.isPending}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            {t("notifications.disable")}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleEnable}
            disabled={isSubscribing || permission === "denied"}
            className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
          >
            {isSubscribing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t("notifications.enable")
            )}
          </Button>
        )}
      </div>

      {/* Preferences (only shown when enabled) */}
      {isEnabled && (
        <>
          {/* Notification Types */}
          <div className="space-y-3 p-4 rounded-xl bg-card border border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              {t("notifications.typesTitle")}
            </h4>

            {[
              {
                key: "notifyCheckin" as const,
                label: t("notifications.checkinLabel"),
                desc: t("notifications.checkinDesc"),
              },
              {
                key: "notifyExercise" as const,
                label: t("notifications.exerciseLabel"),
                desc: t("notifications.exerciseDesc"),
              },
              {
                key: "notifyMilestone" as const,
                label: t("notifications.milestoneLabel"),
                desc: t("notifications.milestoneDesc"),
              },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <Label className="text-sm text-foreground">{label}</Label>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <Switch
                  checked={prefs?.[key] ?? true}
                  onCheckedChange={(checked) =>
                    updatePrefs.mutate({ [key]: checked })
                  }
                />
              </div>
            ))}
          </div>

          {/* Reminder times */}
          <div className="p-4 rounded-xl bg-card border border-border space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              {t("notifications.timesTitle")}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  {t("notifications.checkinTime")}
                </Label>
                <input
                  type="time"
                  defaultValue={prefs?.checkinTime ?? "08:00"}
                  onChange={(e) =>
                    updatePrefs.mutate({ checkinTime: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  {t("notifications.exerciseTime")}
                </Label>
                <input
                  type="time"
                  defaultValue={prefs?.exerciseTime ?? "07:00"}
                  onChange={(e) =>
                    updatePrefs.mutate({ exerciseTime: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Do Not Disturb */}
          <div className="p-4 rounded-xl bg-card border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MoonStar className="w-4 h-4 text-indigo-400" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {t("notifications.dndTitle")}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {t("notifications.dndDesc")}
                  </p>
                </div>
              </div>
              <Switch
                checked={prefs?.dndEnabled ?? false}
                onCheckedChange={(checked) =>
                  updatePrefs.mutate({ dndEnabled: checked })
                }
              />
            </div>

            {prefs?.dndEnabled && (
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    {t("notifications.dndStart")}
                  </Label>
                  <input
                    type="time"
                    defaultValue={prefs?.dndStart ?? "22:00"}
                    onChange={(e) =>
                      updatePrefs.mutate({ dndStart: e.target.value })
                    }
                    className="w-full bg-background border border-indigo-500/30 rounded-lg px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    {t("notifications.dndEnd")}
                  </Label>
                  <input
                    type="time"
                    defaultValue={prefs?.dndEnd ?? "07:00"}
                    onChange={(e) =>
                      updatePrefs.mutate({ dndEnd: e.target.value })
                    }
                    className="w-full bg-background border border-indigo-500/30 rounded-lg px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <p className="col-span-2 text-xs text-indigo-400/80">
                  {t("notifications.dndHint", {
                    start: prefs?.dndStart ?? "22:00",
                    end: prefs?.dndEnd ?? "07:00",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Test notification */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendTest.mutate()}
            disabled={sendTest.isPending}
            className="w-full border-border text-muted-foreground hover:text-foreground"
          >
            {sendTest.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            {t("notifications.sendTest")}
          </Button>
        </>
      )}
    </div>
  );
}
