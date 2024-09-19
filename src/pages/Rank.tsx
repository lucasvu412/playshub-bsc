import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Badge,
  Col,
  Flex,
  Image,
  List,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { getPlayerLeaderBoard } from "../apis/leader-board/plays-leader-board";
import { getProfile } from "../apis/account/profile";
import Loading from "../components/spin/Loading";
import { getLeaderboardPosition } from "../apis/leader-board/position";

export default function Rank() {
  const { data, isLoading } = useQuery({
    queryKey: ["get_leader_board"],
    queryFn: getPlayerLeaderBoard,
  });
  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
  const { data: rankPositionData } = useQuery({
    queryKey: ["rank_position"],
    queryFn: getLeaderboardPosition,
  });

  const ranks = data?.map((item, index) => ({
    accountId: item.accountId,
    displayName: item.displayName,
    avatar: `/icons/rank/avatar/${Math.floor(Math.random() * 8) + 1}.png`,
    plays: item.plays,
    rank: (index + 1).toString(),
    isMe: item.accountId === profileData?.account?.accountId,
  }));

  const rank1st = ranks?.[0];
  const rank2nd = ranks?.[1];
  const rank3rd = ranks?.[2];

  const isMeAtLeaderBoard = ranks?.some((item) => item.isMe);
  if (!isMeAtLeaderBoard) {
    ranks?.push({
      accountId: profileData?.account?.accountId,
      displayName: profileData?.account?.displayName,
      avatar: "/icons/rank/avatar/6.png",
      plays: profileData?.currency.plays,
      rank: !!rankPositionData ? rankPositionData.toString() : "N/A",
      isMe: true,
    });
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div style={{ padding: "10px 0px" }}>
        <Row gutter={[0, 10]}>
          <Col span={24}>
            <Flex vertical style={{ alignItems: "center" }}>
              <div style={{ padding: 10 }}>
                <Image
                  src="/icons/rank/rank-icon.png"
                  preview={false}
                  width={80}
                />
              </div>
              <div>
                <Typography.Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  Rank
                </Typography.Text>
              </div>
            </Flex>
          </Col>
        </Row>
      </div>
      <div>
        <Row gutter={5} align="bottom">
          <Col span={8}>
            {rank2nd && (
              <Flex vertical align="center" gap={15}>
                <Badge count={2} color="#C1C4D1">
                  <Avatar src={rank2nd.avatar} size={70} />
                </Badge>

                <Flex
                  vertical
                  style={{
                    background: "#ffffff",
                    padding: 5,
                    width: "100%",
                    borderRadius: 10,
                  }}
                  align="center"
                >
                  <Typography.Text>{rank2nd.displayName}</Typography.Text>
                  <Space>
                    <Image
                      src="/icons/play/$plays-coin.png"
                      width={20}
                      preview={false}
                    />
                    <Typography.Text style={{ color: "#01BEED" }}>
                      {rank2nd.plays}
                    </Typography.Text>
                  </Space>
                </Flex>
              </Flex>
            )}
          </Col>
          <Col span={8}>
            {rank1st && (
              <Flex vertical align="center" gap={15}>
                <Badge count={1} color="#FFD739">
                  <Avatar src={rank1st.avatar} size={90} />
                </Badge>
                <Flex
                  vertical
                  style={{
                    background: "#ffffff",
                    padding: 5,
                    width: "100%",
                    borderRadius: 10,
                  }}
                  align="center"
                >
                  <Typography.Text>{rank1st.displayName}</Typography.Text>
                  <Space>
                    <Image
                      src="/icons/play/$plays-coin.png"
                      width={20}
                      preview={false}
                    />
                    <Typography.Text style={{ color: "#01BEED" }}>
                      {rank1st.plays}
                    </Typography.Text>
                  </Space>
                </Flex>
              </Flex>
            )}
          </Col>
          <Col span={8}>
            {rank3rd && (
              <Flex vertical align="center" gap={15}>
                <Badge count={3} color="#FF9639">
                  <Avatar src={rank3rd.avatar} size={70} />
                </Badge>
                <Flex
                  vertical
                  style={{
                    background: "#ffffff",
                    padding: 5,
                    width: "100%",
                    borderRadius: 10,
                  }}
                  align="center"
                >
                  <Typography.Text>{rank3rd.displayName}</Typography.Text>
                  <Space>
                    <Image
                      src="/icons/play/$plays-coin.png"
                      width={20}
                      preview={false}
                    />
                    <Typography.Text style={{ color: "#01BEED" }}>
                      {rank3rd.plays}
                    </Typography.Text>
                  </Space>
                </Flex>
              </Flex>
            )}
          </Col>
        </Row>
      </div>
      <div style={{ marginTop: 10 }}>
        <div>
          <Flex align="center" gap={10} style={{ marginBottom: 5 }}>
            <Typography.Text style={{ color: "#767676", fontWeight: "bold" }}>
              TASKS
            </Typography.Text>
          </Flex>
        </div>
        <div style={{ background: "white", padding: "10px" }}>
          <List
            itemLayout="horizontal"
            dataSource={ranks}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} size={50} />}
                  title={
                    <Space>
                      <Typography.Text>{item.displayName}</Typography.Text>
                      {item.isMe && <Tag color="#52AFE2">You</Tag>}
                    </Space>
                  }
                  description={
                    <Space>
                      <Image
                        src="/icons/play/$plays-coin.png"
                        width={22}
                        preview={false}
                      />
                      <Typography.Text
                        style={{ color: "#01BEED" }}
                      >{`${item.plays}`}</Typography.Text>
                    </Space>
                  }
                />
                <div>
                  <Typography.Text>{item.rank}</Typography.Text>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
}
