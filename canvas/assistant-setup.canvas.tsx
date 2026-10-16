import {
  Callout, Card, CardBody, CardHeader, CollapsibleSection, Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text, computeDAGLayout, useHostTheme, useMemo,
} from "cursor/canvas";

const toc = [
  ["vm", "1. 共享 Linux 虚拟机"],
  ["assistants", "2. 助手"],
  ["memory", "3. 记忆"],
  ["connectors", "4. 连接器"],
  ["arch", "5. 架构图"],
  ["faq", "6. 常见问题"],
];

function ArchDiagram() {
  const t = useHostTheme();
  const nodes = [
    { id: "hugo", label: "Hugo" },
    { id: "robin", label: "Robin" }, { id: "gen", label: "Généraliste" },
    { id: "geek", label: "Geek" }, { id: "res", label: "Researcher" },
    { id: "vm", label: "共享虚拟机" }, { id: "mem", label: "记忆（虚拟机之外）" },
    { id: "conn", label: "Notion / Google Drive" },
  ];
  const ids = ["robin", "gen", "geek", "res"];
  const edges = [
    ...ids.map((a) => ({ from: "hugo", to: a })),
    ...ids.flatMap((a) => [{ from: a, to: "vm" }, { from: a, to: "mem" }, { from: a, to: "conn" }]),
  ];
  const L = useMemo(() => computeDAGLayout({ nodes, edges, nodeWidth: 150, nodeHeight: 40 }), []);
  const label = (id: string) => nodes.find((n) => n.id === id)!.label;
  return (
    <svg width={L.width} height={L.height} role="img" aria-label="架构图">
      {L.edges.map((e, i) => (
        <line key={i} x1={e.sourceX} y1={e.sourceY} x2={e.targetX} y2={e.targetY} stroke={t.stroke.secondary} />
      ))}
      {L.nodes.map((n) => (
        <g key={n.id}>
          <rect x={n.x} y={n.y} width={150} height={40} rx={6} fill={t.bg.elevated} stroke={t.stroke.primary} />
          <text x={n.x + 75} y={n.y + 25} textAnchor="middle" fill={t.text.primary} fontSize={12}>{label(n.id)}</text>
        </g>
      ))}
    </svg>
  );
}

export default function AssistantSetupDocs() {
  const t = useHostTheme();
  return (
    <Grid columns="200px 1fr" gap={32} align="start">
      <Stack gap={6} style={{ position: "sticky", top: 16 }}>
        <Text size="small" tone="tertiary" weight="semibold">目录</Text>
        {toc.map(([id, title]) => (
          <a key={id} href={`#${id}`} style={{ color: t.text.secondary, textDecoration: "none" }}>{title}</a>
        ))}
      </Stack>
      <Stack gap={28}>
        <Card size="lg">
          <CardHeader trailing={<Pill tone="info">概览</Pill>}>Hugo 的助手系统是怎么运作的</CardHeader>
          <CardBody>
            <Stack gap={12}>
              <Text>四个助手共用一台 Linux 虚拟机，各自有独立的桌面和对话；记忆保存在虚拟机之外；报告统一写得详细深入并存到 Google Drive。</Text>
              <Grid columns={4} gap={12}>
                <Stat value="8" label="vCPU" />
                <Stat value="~15 GB" label="内存（稳定可用约 4 GB）" tone="warning" />
                <Stat value="125 GB" label="磁盘" />
                <Stat value="4" label="助手" tone="info" />
              </Grid>
            </Stack>
          </CardBody>
        </Card>

        <section id="vm"><Stack gap={10}>
          <H2>1. 共享 Linux 虚拟机</H2>
          <Table headers={["项目", "配置", "说明"]} striped rows={[
            ["系统", "Debian 13 (trixie)", "x86_64"],
            ["CPU", "8 vCPU，Intel Xeon", "具体型号被隐藏"],
            ["内存", "~15 GB", "因 virtio balloon，稳定可用约 4 GB"],
            ["磁盘", "125 GB", "空间充裕"],
            ["GPU", "无", "不适合本地大模型"],
          ]} rowTone={[undefined, undefined, "warning", undefined, "danger"]} />
          <Callout tone="warning" title="内存提示">宿主机通过内存气球回收了部分内存，同时运行多个吃内存的任务可能被系统终止。</Callout>
        </Stack></section>

        <section id="assistants"><Stack gap={10}>
          <H2>2. 助手</H2>
          <Row gap={8} wrap>{["Robin", "Généraliste", "Geek", "Researcher"].map((n) => <Pill key={n}>{n}</Pill>)}</Row>
          <Text>所有助手共用同一台机器：文件、已安装的工具、浏览器登录状态彼此可见。但每个助手有自己的桌面和对话，互相看不到对方的屏幕。</Text>
        </Stack></section>

        <section id="memory"><Stack gap={10}>
          <H2>3. 记忆</H2>
          <Grid columns={2} gap={12}>
            <Card><CardHeader>各助手自己的记忆</CardHeader><CardBody><Text>与各自工作相关的规则和任务，每个助手单独一份。</Text></CardBody></Card>
            <Card><CardHeader>共享用户记忆</CardHeader><CardBody><Text>关于 Hugo 本人的长期信息与偏好，所有助手都能读到。</Text></CardBody></Card>
          </Grid>
          <Callout tone="info" title="存储位置">记忆保存在虚拟机之外，虚拟机重置也不会丢失。</Callout>
        </Stack></section>

        <section id="connectors"><Stack gap={10}>
          <H2>4. 连接器</H2>
          <Table headers={["连接器", "状态", "用途"]} rows={[
            ["Notion", <Pill tone="success">已连接</Pill>, "笔记、补充文档"],
            ["Google Drive", <Pill tone="success">已连接</Pill>, "所有报告的默认存放位置"],
          ]} />
          <Callout tone="success" title="报告规则">报告一律写得详细深入，并保存到 Google Drive。</Callout>
        </Stack></section>

        <section id="arch"><Stack gap={10}>
          <H2>5. 架构图</H2>
          <ArchDiagram />
        </Stack></section>

        <section id="faq"><Stack gap={4}>
          <H2>6. 常见问题</H2>
          <Divider />
          <CollapsibleSection title="需要自己搭建记忆系统吗？" defaultOpen><Text>不需要，记忆系统是内置的。</Text></CollapsibleSection>
          <CollapsibleSection title="为什么刚启动内存就显示用了很多？"><Text>大部分被 virtio balloon 收回给宿主机，并非进程占用。</Text></CollapsibleSection>
          <CollapsibleSection title="报告存在哪里？"><Text>Google Drive。</Text></CollapsibleSection>
          <CollapsibleSection title="能在这台虚拟机上跑本地大模型吗？"><Text>没有 GPU，不适合。</Text></CollapsibleSection>
        </Stack></section>
      </Stack>
    </Grid>
  );
}
