import { useMutation, useQuery } from "@tanstack/react-query";
import { useTonConnectModal, useTonConnectUI } from "@tonconnect/ui-react";
import { Button, Drawer, Flex, Image, Space, Typography } from "antd";
import { getQuestStatus } from "../../apis/quest/get-quest-status";
import { checkQuest } from "../../apis/quest/check-quest";
import { proceedQuest } from "../../apis/quest/proceed-quest";
import { useEffect } from "react";
import { useNotification } from "../../providers/NotificationProvider";

export interface ConnectWalletDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function ConnectWalletDrawer({
  open,
  onClose,
}: ConnectWalletDrawerProps) {
  const { open: openTonConnectModal } = useTonConnectModal();
  const [tonConnectUI] = useTonConnectUI();
  const { data, refetch } = useQuery({
    queryKey: ["get_quest_status"],
    queryFn: getQuestStatus,
  });
  const checkQuestMutation = useMutation({
    mutationFn: () => checkQuest("DAILY", "CONNECT_TON_WALLET"),
  });
  const proceedQuestMutation = useMutation({
    mutationFn: () => proceedQuest("DAILY", "CONNECT_TON_WALLET"),
  });
  const task = data?.find((item) => item.requestType === "CONNECT_TON_WALLET");
  const earn = task?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0;

  const connect = async () => {
    await proceedQuestMutation.mutateAsync();
    if (tonConnectUI.connected) {
      await tonConnectUI.disconnect();
    }

    openTonConnectModal();
    onClose();
    return;
  };

  const notification = useNotification()!;
  useEffect(() => {
    if (checkQuestMutation.isSuccess) {
      notification.success("Completed");
      refetch();
      onClose();
    }
  }, [checkQuestMutation.isSuccess]);

  useEffect(() => {
    if (checkQuestMutation.isError) {
      notification.warning("You have not completed the quest");
    }
  }, [checkQuestMutation.isError]);

  return (
    <Drawer open={open} footer={null} placement="bottom" onClose={onClose}>
      <Flex vertical align="center" gap={15}>
        <Flex vertical align="center">
          <div style={{ padding: 10 }}>
            <Image
              src="/icons/earn/connect-ton-wallet.png"
              preview={false}
              width={80}
            />
          </div>
          <Space>
            <Typography.Text style={{ color: "#01BEED" }}>
              {`+${earn}`}
            </Typography.Text>
            <Image
              src="/icons/play/$plays-coin.png"
              width={20}
              preview={false}
            />
          </Space>
        </Flex>
        <Flex vertical align="center">
          <Typography.Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Ton Wallet
          </Typography.Text>
          <Typography.Text>Connect Ton Wallet to get rewards</Typography.Text>
        </Flex>
        <Flex vertical gap={10} style={{ width: "70%" }}>
          <Button type="primary" onClick={connect} style={{ padding: 20 }}>
            Connect
          </Button>
          <Button
            type="default"
            style={{ padding: 20 }}
            onClick={() => checkQuestMutation.mutate()}
          >
            Check
          </Button>
        </Flex>
      </Flex>
    </Drawer>
  );
}
