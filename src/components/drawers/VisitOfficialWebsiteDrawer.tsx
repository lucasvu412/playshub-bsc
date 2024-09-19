import { Button, Drawer, Flex, Image, Space, Typography } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQuestStatus } from "../../apis/quest/get-quest-status";
import { checkQuest } from "../../apis/quest/check-quest";
import { proceedQuest } from "../../apis/quest/proceed-quest";
import { useNotification } from "../../providers/NotificationProvider";
import { useEffect } from "react";

export interface VisitOfficialWebsiteDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function VisitOfficialWebsiteDrawer({
  open,
  onClose,
}: VisitOfficialWebsiteDrawerProps) {
  const { data, refetch } = useQuery({
    queryKey: ["get_quest_status"],
    queryFn: getQuestStatus,
  });
  const checkQuestMutation = useMutation({
    mutationFn: () => checkQuest("DAILY", "VISIT_OFFICIAL_WEBSITE"),
  });
  const proceedQuestMutation = useMutation({
    mutationFn: () => proceedQuest("DAILY", "VISIT_OFFICIAL_WEBSITE"),
  });
  const task = data?.find(
    (item) => item.requestType === "VISIT_OFFICIAL_WEBSITE"
  );
  const earn = task?.reward?.match(/PLAYS:(\d+)/)?.[1] || 0;

  const visit = async () => {
    await proceedQuestMutation.mutateAsync();
    if (task?.additional) {
      Telegram?.WebApp?.openLink(task.additional);
    }
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
              src="/icons/earn/visit-website.png"
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
            PLAYS Hub
          </Typography.Text>
          <Typography.Text>Visit official website to get bonus</Typography.Text>
        </Flex>
        <Flex vertical gap={10} style={{ width: "70%" }}>
          <Button type="primary" onClick={visit} style={{ padding: 20 }}>
            Visit
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
