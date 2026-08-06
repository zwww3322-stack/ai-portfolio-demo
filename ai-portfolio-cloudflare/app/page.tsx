"use client";

import { useEffect, useMemo, useState } from "react";

const strategyText =
  "8月8日至10日，为海川市机场和大学城的周末兼职服务者配置晚高峰保障策略，18:00–22:00完成3单奖励15元、完成5单再奖励20元，单日预算5万元。";

const strategyTemplates = [
  { name: "周末场站保障", text: strategyText, tag: "机场 · 大学城", dates: ["08-08", "08-09", "08-10"], zones: ["海川机场", "滨海大学城"], audience: "周末兼职服务者", time: "18:00–22:00", reward: "3单+15 / 5单+20", budget: "¥50,000", score: 67, issueRows: [2, 5], issues: [["区域与人群不匹配", "08-09 海川机场 · 建议使用场站周边人群包"], ["单日预算超过上限", "08-10 滨海大学城 · 超出¥10,000"]], exposure: "12,600", claim: "3,276", drive: "2,031", redeem: "1,320", orders: "+8,460", spend: "¥286,000", cost: "¥33.8", roi: "2.4", message: "8月8日至10日晚高峰，机场及大学城接单机会增加。完成指定订单可获得阶梯奖励，请合理安排出车时间。" },
  { name: "夜间娱乐场景", text: "本周五至周日，为海川市欢乐里和万象商圈的夜间活跃服务者配置22:00–02:00保障策略，完成4单奖励18元、完成7单再奖励25元，单日预算4万元。", tag: "商圈 · 夜间", dates: ["08-09", "08-10"], zones: ["欢乐里娱乐区", "万象商场"], audience: "夜间活跃服务者", time: "22:00–02:00", reward: "4单+18 / 7单+25", budget: "¥40,000", score: 92, issueRows: [3], issues: [["跨日时段触达待确认", "08-10 万象商场 · 建议将次日结束时间同步至话术"]], exposure: "8,420", claim: "2,610", drive: "1,514", redeem: "984", orders: "+5,210", spend: "¥168,000", cost: "¥32.2", roi: "2.8", message: "本周五至周日夜间，欢乐里与万象商圈订单升温。22:00后完成指定订单可获得阶梯奖励，跨日时段以次日02:00为结束时间。" },
  { name: "工作日早高峰", text: "下周一至周五，为北港居住区至西岸商务区的早高峰活跃服务者配置07:00–10:00通勤保障策略，完成3单奖励12元，单日预算3万元。", tag: "通勤 · 早峰", dates: ["08-12", "08-13", "08-14", "08-15", "08-16"], zones: ["北港居住区", "西岸商务区"], audience: "早高峰活跃服务者", time: "07:00–10:00", reward: "完成3单+12", budget: "¥30,000", score: 100, issueRows: [], issues: [], exposure: "15,300", claim: "3,366", drive: "2,390", redeem: "1,721", orders: "+9,180", spend: "¥325,000", cost: "¥35.4", roi: "2.5", message: "下周一至周五早高峰，北港居住区与西岸商务区通勤需求集中。07:00–10:00完成3单可获得12元奖励。" },
];

type Scenario = "normal" | "rain" | "holiday";

const zones = [
  { name: "海川机场", icon: "机", x: 80, y: 26, rain: "high", holiday: "balanced", normal: "balanced" },
  { name: "滨海大学城", icon: "校", x: 68, y: 72, rain: "high", holiday: "balanced", normal: "balanced" },
  { name: "西岸商务区", icon: "商", x: 24, y: 54, rain: "supply", holiday: "supply", normal: "high" },
  { name: "北港居住区", icon: "人", x: 40, y: 21, rain: "balanced", holiday: "supply", normal: "supply" },
  { name: "中心医院", icon: "医", x: 51, y: 34, rain: "balanced", holiday: "balanced", normal: "balanced" },
  { name: "万象商场", icon: "购", x: 61, y: 49, rain: "balanced", holiday: "high", normal: "balanced" },
  { name: "海川火车站", icon: "站", x: 31, y: 72, rain: "balanced", holiday: "high", normal: "high" },
  { name: "欢乐里娱乐区", icon: "娱", x: 52, y: 76, rain: "balanced", holiday: "high", normal: "supply" },
];

const scenarioConfigs = {
  rain: { label: "突发强降雨", time: "8月8日 19:42", demand: "126", demandTrend: "+38.6%", supply: "2,864", supplyTrend: "-11.8%", source: "西岸商务区", firstTarget: "海川机场", totalGap: 70, gaps: { "海川机场": 42, "滨海大学城": 28 }, messages: { "海川机场": "【强降雨保障】海川机场到达需求快速上涨，建议前往机场蓄车区承接订单。请注意雨天行车安全。", "滨海大学城": "【强降雨保障】滨海大学城需求快速上涨，建议前往大学城核心区承接订单。请注意雨天行车安全。" } },
  holiday: { label: "节假日客流", time: "10月1日 17:20", demand: "138", demandTrend: "+46.2%", supply: "2,730", supplyTrend: "-14.5%", source: "北港居住区", firstTarget: "海川火车站", totalGap: 78, gaps: { "海川火车站": 36, "万象商场": 24, "欢乐里娱乐区": 18 }, messages: { "海川火车站": "【节假日客流保障】海川火车站到站客流集中释放，建议前往落客区周边承接订单，注意站区临时交通管制。", "万象商场": "【节假日客流保障】万象商场消费客流进入高峰，建议前往商圈外沿上车点承接订单。", "欢乐里娱乐区": "【节假日客流保障】欢乐里夜间休闲客流升温，建议前往推荐上车点承接订单。" } },
  normal: { label: "工作日早高峰", time: "8月12日 07:42", demand: "112", demandTrend: "+21.4%", supply: "3,060", supplyTrend: "-6.3%", source: "北港居住区", firstTarget: "西岸商务区", totalGap: 50, gaps: { "西岸商务区": 34, "海川火车站": 16 }, messages: { "西岸商务区": "【早高峰通勤保障】西岸商务区通勤需求进入峰值，建议沿推荐通勤走廊前往核心办公区承接订单。", "海川火车站": "【早高峰通勤保障】海川火车站早间到站需求增加，建议前往南广场推荐上车点承接订单。" } },
} as const;

const roads = [
  "M32 372 C158 310 210 346 308 280 S510 185 728 238 S920 342 1090 260",
  "M80 180 C260 235 346 192 472 120 S760 52 1014 132",
  "M120 504 C286 418 408 468 566 392 S830 318 1056 454",
  "M244 42 C258 168 332 252 300 518",
  "M544 20 C512 152 570 254 552 542",
  "M844 50 C792 168 822 328 858 530",
  "M54 286 C238 248 390 286 542 270 S852 242 1100 324",
  "M152 70 C318 142 380 206 460 354 S624 474 812 506",
  "M1012 52 C918 160 868 210 754 270 S630 392 608 530",
];

type MonitorStep = "idle" | "rain" | "detected" | "dispatch" | "sent";

function BrandMark() {
  return (
    <div className="brand-mark" aria-label="张唯个人AI作品集">
      <span className="brand-symbol"><i /><i /></span>
      <span>张唯个人AI作品集</span>
    </div>
  );
}

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

function VirtualDataBadge() {
  return <span className="virtual-data-badge">虚拟数据</span>;
}

function DemoDataNotice() {
  return <div className="demo-data-notice"><strong>演示数据说明</strong><p>项目源于出行运营场景的真实实践抽象重构，不包含内部系统页面、接口和真实经营数据。“海川市”、人员、人群、策略、预算及地图均为虚构内容。</p></div>;
}

function SiteHeader({ active }: { active: "home" | "supply" | "strategy" | "about" }) {
  return (
    <header className="site-header">
      <a href="/" aria-label="返回首页"><BrandMark /></a>
      <nav>
        <a className={active === "home" ? "active" : ""} href="/">首页</a>
        <a className={active === "supply" ? "active" : ""} href="/supply">作品一 · 供需盯盘</a>
        <a className={active === "strategy" ? "active" : ""} href="/strategy">作品二 · 策略中心</a>
        <a className={active === "about" ? "active" : ""} href="/about">关于作品集</a>
      </nav>
      <a className="header-cta" href={active === "strategy" ? "/supply" : "/strategy"}>体验产品Demo <ArrowIcon /></a>
    </header>
  );
}

function SupplyMap({ step, scenario, target, onSelect }: { step: MonitorStep; scenario: Scenario; target: string; onSelect: (name: string) => void }) {
  const active = step !== "idle";
  const weather = scenario === "rain" ? "强降雨 28mm/h" : scenario === "holiday" ? "节假日 · 客流高峰" : "工作日早高峰";
  const riskText = { high: "供不应求", supply: "供大于求", balanced: "供需平衡" };
  const sourcePoint = zones.find((zone) => zone.name === scenarioConfigs[scenario].source);
  const targetPoint = zones.find((zone) => zone.name === target);
  return (
    <div className={`supply-map ${active ? "night" : "day"}`}>
      <div className="map-topline">
        <div>
          <span className="live-dot" /> 实时监控中
          <b>海川市 · {scenarioConfigs[scenario].time}</b>
        </div>
        <div className="weather-pill">{active ? weather : "自动扫描待运行"}</div>
      </div>

      <svg className="road-map" viewBox="0 0 1120 560" role="img" aria-label="虚构海川市供需地图">
        <defs>
          <linearGradient id="river" x1="0" x2="1">
            <stop offset="0" stopColor="#6fb5d8" stopOpacity=".08" />
            <stop offset=".5" stopColor="#52a7d0" stopOpacity=".24" />
            <stop offset="1" stopColor="#6fb5d8" stopOpacity=".06" />
          </linearGradient>
        </defs>
        <path className="river" d="M-20 112 C190 160 246 78 410 148 S688 248 842 192 S1030 96 1140 140 L1140 204 C1010 166 938 280 784 252 S520 180 370 214 S134 236 -20 188 Z" fill="url(#river)" />
        {roads.map((d, index) => <path key={d} d={d} className={`road road-${index % 3}`} />)}
        {Array.from({ length: 18 }).map((_, i) => (
          <path key={i} className="street" d={`M${80 + i * 55} ${80 + (i % 4) * 54} l${90 + (i % 3) * 28} ${70 - (i % 5) * 22}`} />
        ))}
        <path className="ring-road" d="M270 135 C430 30 760 34 908 174 C1048 308 900 494 672 520 C408 550 204 446 194 292 C188 222 214 174 270 135Z" />
      </svg>

      {active && <div className="heat-layer" aria-hidden="true">
        {zones.map((zone) => (
          <span key={zone.name} className={`heat-cell ${zone[scenario]}`} style={{ left: `${zone.x}%`, top: `${zone.y}%` }} />
        ))}
      </div>}

      {step === "rain" && <div className="scan-line" aria-hidden="true"><i /></div>}

      {zones.map((zone) => {
        const zoneRisk = active ? String(zone[scenario]) : "balanced";
        return (
        <button
          key={zone.name}
          className={`map-marker ${zoneRisk}`}
          style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
          onClick={() => onSelect(zone.name)}
          aria-label={`查看${zone.name}`}
        >
          <span className="marker-pulse" />
          <span className="marker-icon">{zone.icon}</span>
          <span className="marker-label"><b>{zone.name}</b>{active ? riskText[zoneRisk as keyof typeof riskText] : "等待扫描"}</span>
        </button>
      )})}

      {step === "dispatch" || step === "sent" ? (
        <svg className="dispatch-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {sourcePoint && targetPoint && <path d={`M${sourcePoint.x} ${sourcePoint.y} C${sourcePoint.x + 12} ${sourcePoint.y} ${targetPoint.x - 12} ${targetPoint.y} ${targetPoint.x} ${targetPoint.y}`} />}
        </svg>
      ) : null}

      <div className="map-legend">
        <span><i className="legend-neutral" />供需平衡</span>
        <span><i className="legend-orange" />供不应求</span>
        <span><i className="legend-blue" />供大于求</span>
      </div>
      <div className="map-disclaimer">虚构城市与模拟数据 · 仅用于产品能力演示</div>
    </div>
  );
}

function SupplyDemo() {
  const [step, setStep] = useState<MonitorStep>("rain");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState("海川机场");
  const [tab, setTab] = useState<"live" | "tasks" | "records">("live");
  const [scenario, setScenario] = useState<Scenario>("rain");
  const [scanVersion, setScanVersion] = useState(0);
  const scenarioData = scenarioConfigs[scenario];
  const selectedGap = scenarioData.gaps[selected as keyof typeof scenarioData.gaps];

  useEffect(() => {
    setSelected(scenarioConfigs[scenario].firstTarget);
    setDrawerOpen(false);
    setStep("rain");
    const timer = window.setTimeout(() => setStep("detected"), 1100);
    return () => window.clearTimeout(timer);
  }, [scenario, scanVersion]);

  const reset = () => {
    setDrawerOpen(false);
    setScanVersion((value) => value + 1);
  };

  return (
    <div className="demo-shell supply-shell">
      <div className="demo-toolbar">
        <BrandMark />
        <nav>
          <button className={tab === "live" ? "active" : ""} onClick={() => setTab("live")}>实时供需</button>
          <button className={tab === "tasks" ? "active" : ""} onClick={() => setTab("tasks")}>监控任务</button>
          <button className={tab === "records" ? "active" : ""} onClick={() => setTab("records")}>调度记录</button>
        </nav>
        <div className="toolbar-actions"><VirtualDataBadge /><span>每1分钟自动监控</span><button onClick={reset}>重置演示</button></div>
      </div>
      {tab === "live" ? <div className="supply-body">
        <aside className="metric-rail">
          <div className="rail-title">供需概览 <span>LIVE</span></div>
          <div className="metric"><small>全市需求指数</small><strong className="orange">{scenarioData.demand}</strong><em>{scenarioData.demandTrend}</em></div>
          <div className="metric"><small>在线供给</small><strong>{scenarioData.supply}</strong><em className="down">{scenarioData.supplyTrend}</em></div>
          <div className="metric"><small>风险区域</small><strong>{Object.keys(scenarioData.gaps).length}</strong><em>需干预</em></div>
          <div className="scenario-picker">
            <small>模拟场景</small>
            <button className={scenario === "normal" ? "active" : ""} onClick={() => setScenario("normal")}>工作日早峰</button>
            <button className={scenario === "rain" ? "active" : ""} onClick={() => setScenario("rain")}>突发强降雨</button>
            <button className={scenario === "holiday" ? "active" : ""} onClick={() => setScenario("holiday")}>节假日客流</button>
          </div>
          <div className="monitor-card">
            <span className="monitor-icon">◎</span>
            <b>自动监控</b>
            <small>下一次运行 19:45</small>
            <div className="progress"><i /></div>
          </div>
          <button className="primary-action" onClick={reset}>
            {step === "rain" ? `正在扫描 · ${scenarioData.label}` : `已完成 · 重新扫描`}
          </button>
        </aside>
        <main className="map-stage">
          <SupplyMap step={step} scenario={scenario} target={selected} onSelect={(name) => { if (name in scenarioData.gaps) { setSelected(name); setDrawerOpen(true); } }} />
          {step === "detected" && !drawerOpen && (
            <div className="insight-toast">
              <span>AI</span><div><b>扫描完成 · 发现{Object.keys(scenarioData.gaps).length}处供需洼地</b><small>当前场景总缺口{scenarioData.totalGap}人 · 已生成分区调度方案</small></div>
              <button onClick={() => setDrawerOpen(true)}>查看方案</button>
            </div>
          )}
          {step === "sent" && (
            <div className="task-success">
              <span>✓</span><div><b>调度任务已创建</b><small>任务 #HC-0808-1942 · 已推送至2个协作群</small></div><em>执行中</em>
            </div>
          )}
        </main>
        <aside className={`dispatch-drawer ${drawerOpen ? "open" : ""}`}>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>×</button>
          <div className="eyebrow">AI 调度建议</div>
          <h3>{selected}</h3>
          <p>{scenario === "rain" ? "强降雨造成需求快速升温" : scenario === "holiday" ? "节假日客流造成需求集中释放" : "通勤需求进入早高峰"}，预计未来30分钟供给承接不足。</p>
          <div className="gap-number"><small>建议补充供给</small><strong>{selectedGap ?? 0}<i>人</i></strong></div>
          <div className="route-card">
            <small>推荐调度来源</small>
            <b>{scenarioData.source} → {selected}</b>
            <span>预计{scenario === "holiday" ? "16" : scenario === "normal" ? "12" : "18"}分钟抵达 · 响应率{scenario === "holiday" ? "76" : scenario === "normal" ? "81" : "72"}%</span>
          </div>
          <label>调度人数<input key={`${scenario}-${selected}`} defaultValue={selectedGap ?? 0} /></label>
          <label>任务有效期<select defaultValue="30"><option value="30">30分钟</option><option value="45">45分钟</option></select></label>
          <div className="message-preview">
            <small>群消息预览</small>
            <p>{scenarioData.messages[selected as keyof typeof scenarioData.messages]}</p>
          </div>
          <button className="drawer-submit" onClick={() => { setStep("dispatch"); window.setTimeout(() => { setStep("sent"); setDrawerOpen(false); }, 500); }}>创建任务并推送</button>
        </aside>
      </div> : tab === "tasks" ? <MonitorTasks /> : <DispatchRecords />}
    </div>
  );
}

function MonitorTasks() {
  const tasks = [
    ["08-08 19:40", "突发强降雨", "全市5分钟扫描", "2处", "2次", "已完成"],
    ["08-08 07:10", "工作日早高峰", "重点区域扫描", "1处", "1次", "已完成"],
    ["08-07 20:00", "节假日客流", "全市10分钟扫描", "3处", "2次", "已完成"],
    ["08-07 17:30", "晚高峰常规", "重点区域扫描", "0处", "0次", "正常"],
  ];
  return <div className="operations-view"><div className="view-summary"><div><small>今日运行</small><strong>48</strong></div><div><small>识别风险</small><strong>6</strong></div><div><small>触发调度</small><strong>5</strong></div><div><small>平均响应</small><strong>2.4分钟</strong></div></div><div className="operations-card"><div className="operations-title"><div><span className="live-dot" />监控任务</div><button>＋ 新建任务</button></div><table><thead><tr><th>创建时间</th><th>模拟场景</th><th>运行规则</th><th>风险区域</th><th>触发调度</th><th>状态</th></tr></thead><tbody>{tasks.map((row) => <tr key={row[0]}>{row.map((cell, i) => <td key={cell}>{i === 5 ? <span className="status-ok">{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div></div>;
}

function DispatchRecords() {
  const records = [
    ["海川机场", "42人", "31人", "74%", "+286单", "+6.8pp"],
    ["滨海大学城", "28人", "22人", "79%", "+164单", "+5.2pp"],
    ["万象商场", "35人", "24人", "69%", "+198单", "+4.7pp"],
    ["海川火车站", "30人", "25人", "83%", "+215单", "+7.1pp"],
  ];
  return <div className="operations-view"><div className="view-summary"><div><small>累计调度</small><strong>135人</strong></div><div><small>成功响应</small><strong>102人</strong></div><div><small>订单增量</small><strong>863单</strong></div><div><small>平均完成率提升</small><strong>+6.0pp</strong></div></div><div className="operations-card"><div className="operations-title"><div>调度效果记录</div><span>近7日</span></div><table><thead><tr><th>调度区域</th><th>建议人数</th><th>实际响应</th><th>调度成功率</th><th>预计增加订单</th><th>完成率提升</th></tr></thead><tbody>{records.map((row) => <tr key={row[0]}>{row.map((cell, i) => <td key={cell} className={i > 2 ? "positive-cell" : ""}>{cell}</td>)}</tr>)}</tbody></table></div></div>;
}

type StrategyStatus = "idle" | "generated" | "fixed";

function StrategyDemo() {
  const [status, setStatus] = useState<StrategyStatus>("idle");
  const [input, setInput] = useState(strategyText);
  const [tab, setTab] = useState<"forecast" | "workshop" | "materials" | "tasks">("forecast");
  const [template, setTemplate] = useState(0);
  const templateData = strategyTemplates[template];
  const strategies = useMemo(() => {
    const activeTemplate = strategyTemplates[template];
    return activeTemplate.dates.flatMap((date) => activeTemplate.zones.map((zone, index) => ({
      date, zone, audience: template === 0 && index === 0 && date === "08-09" && status === "generated" ? `${activeTemplate.audience}（区域待校验）` : activeTemplate.audience,
      time: activeTemplate.time, reward: activeTemplate.reward, budget: template === 0 && date === "08-10" && index === 1 && status === "generated" ? "¥60,000" : activeTemplate.budget,
    })));
  }, [status, template]);
  const qualityScore = status === "fixed" ? 100 : templateData.score;
  const activeIssues = status === "fixed" ? [] : templateData.issues;

  return (
    <div className="demo-shell strategy-shell">
      <div className="demo-toolbar">
        <BrandMark />
        <nav>
          <button className={tab === "forecast" ? "active" : ""} onClick={() => setTab("forecast")}>供需预测</button>
          <button className={tab === "workshop" ? "active" : ""} onClick={() => setTab("workshop")}>策略车间</button>
          <button className={tab === "materials" ? "active" : ""} onClick={() => setTab("materials")}>生产资料</button>
          <button className={tab === "tasks" ? "active" : ""} onClick={() => setTab("tasks")}>任务复盘</button>
        </nav>
        <div className="toolbar-actions"><VirtualDataBadge /><button onClick={() => { setStatus("idle"); setTab("workshop"); }}>新建策略</button></div>
      </div>
      {tab === "forecast" ? <SupplyForecast onCreate={(index) => { setTemplate(index); setInput(strategyTemplates[index].text); setStatus("idle"); setTab("workshop"); }} /> : tab === "workshop" ? <div className="strategy-body">
        <section className="prompt-panel">
          <div className="section-heading"><div><span className="step-no">01</span><h3>一句话描述策略</h3></div><em>AI解析</em></div>
          <div className="template-list">{strategyTemplates.map((item, i) => <button key={item.name} className={template === i ? "active" : ""} onClick={() => { setTemplate(i); setInput(item.text); setStatus("idle"); }}><b>{item.name}</b><small>{item.tag}</small></button>)}</div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} aria-label="策略描述" />
          <div className="prompt-tags"><span>{templateData.dates.length}个日期</span><span>{templateData.zones.length}个区域</span><span>{template === 2 ? "单级奖励" : "2级奖励"}</span><span>单日预算</span></div>
          <button className="generate-button" onClick={() => setStatus("generated")} disabled={!input.trim()}><span>✦</span>{status === "idle" ? "解析并批量生成" : `重新生成${strategies.length}条策略`}</button>
          <div className="ai-note"><b>产品判断</b><p>AI负责把自然语言转换为结构化字段；最终策略仍由运营审核后提交。</p></div>
        </section>

        <section className="strategy-workbench">
          <div className="section-heading"><div><span className="step-no">02</span><h3>策略批量预览</h3></div><em>{status === "idle" ? "等待生成" : `共${strategies.length}条`}</em></div>
          {status === "idle" ? (
            <div className="empty-strategy"><span>✦</span><b>等待解析策略描述</b><small>系统将自动拆分日期、区域、人群与奖励阶梯</small></div>
          ) : (
            <><div className="strategy-table-wrap">
              <table className="strategy-table">
                <thead><tr><th>日期</th><th>区域</th><th>目标人群</th><th>时段</th><th>奖励阶梯</th><th>预算</th><th>状态</th></tr></thead>
                <tbody>{strategies.map((item, i) => {
                  const hasError = status === "generated" && templateData.issueRows.includes(i);
                  return <tr key={`${item.date}-${item.zone}`} className={hasError ? "error-row" : ""}>
                    <td>{item.date}</td><td>{item.zone}</td><td>{item.audience}</td><td>{item.time}</td><td>{item.reward}</td><td>{item.budget}</td><td><span className={hasError ? "status-error" : "status-ok"}>{hasError ? "需修正" : "通过"}</span></td>
                  </tr>;
                })}</tbody>
              </table>
            </div><div className="effect-preview"><div className="effect-title"><b>策略前效预测</b><span>基于近30日同类策略</span></div><div className="funnel-row"><div><small>预计曝光</small><strong>{templateData.exposure}</strong></div><i>→</i><div><small>预计领取</small><strong>{templateData.claim}</strong><em>{template === 1 ? "31%" : template === 2 ? "22%" : "26%"}</em></div><i>→</i><div><small>预计出车</small><strong>{templateData.drive}</strong><em>{template === 1 ? "58%" : template === 2 ? "71%" : "62%"}</em></div><i>→</i><div><small>预计核销</small><strong>{templateData.redeem}</strong><em>{template === 1 ? "65%" : template === 2 ? "72%" : "65%"}</em></div></div><div className="effect-kpis"><span><small>预计增量订单</small><b>{templateData.orders}</b></span><span><small>预计消耗预算</small><b>{templateData.spend}</b></span><span><small>预计单均成本</small><b>{templateData.cost}</b></span><span><small>预计ROI</small><b>{templateData.roi}</b></span></div></div></>
          )}
        </section>

        <aside className="validation-panel">
          <div className="section-heading"><div><span className="step-no">03</span><h3>策略质检</h3></div></div>
          {status === "idle" ? <div className="validation-empty">生成策略后自动运行校验</div> : activeIssues.length > 0 ? <>
            <div className={`score-ring ${qualityScore >= 90 ? "near-pass" : "warning"}`} style={{ background: `conic-gradient(${qualityScore >= 90 ? "#6d5dfc" : "var(--orange)"} 0 ${qualityScore}%,#26354a ${qualityScore}%)` }}><strong>{qualityScore}</strong><small>质量得分</small></div>
            <div className="check-summary"><span className="ok">{6 - activeIssues.length}项通过</span><span className="error">{activeIssues.length}项待确认</span></div>
            {activeIssues.map(([title, detail]) => <div className="issue-card" key={title}><i>!</i><div><b>{title}</b><small>{detail}</small></div></div>)}
            <button className="fix-button" onClick={() => setStatus("fixed")}>一键修正并重新校验</button>
          </> : <>
            <div className="score-ring success"><strong>100</strong><small>质量得分</small></div>
            <div className="all-passed">✓ {strategies.length}条策略全部通过校验</div>
            <div className="check-list"><span>✓ 日期与时段</span><span>✓ 人群与区域</span><span>✓ 奖励阶梯</span><span>✓ 预算上限</span></div>
            <div className="message-preview light"><small>触达话术</small><p>{templateData.message}</p></div>
            <button className="export-button">导出策略汇总</button>
          </>}
        </aside>
      </div> : tab === "materials" ? <ProductionMaterials /> : <StrategyTasks />}
    </div>
  );
}

function SupplyForecast({ onCreate }: { onCreate: (index: number) => void }) {
  const days = [["周一", 62, 78], ["周二", 66, 80], ["周三", 70, 82], ["周四", 74, 83], ["周五", 88, 79], ["周六", 96, 74], ["周日", 91, 76]];
  const issues = [
    { level: "高", title: "周末场站集中返程", detail: "机场与大学城模拟需求指数预计增加30点，晚高峰存在明显供给缺口。", metric: "模拟缺口 40人", template: 0 },
    { level: "中", title: "夜间休闲需求延后", detail: "欢乐里与万象商圈22:00后模拟需求指数增加20点，夜间运力结构偏弱。", metric: "指数 +20", template: 1 },
    { level: "稳", title: "工作日早峰通勤走廊", detail: "北港至西岸方向07:00–10:00模拟需求指数增加15点，可提前配置保障。", metric: "指数 +15", template: 2 },
  ];
  return <div className="forecast-view">
    <div className="forecast-heading"><div><span className="step-no">01</span><div><h3>本周供需预测</h3><p>采用基准值100的模拟指数，识别未来7天需要应对的问题</p></div></div><span className="forecast-updated">演示周期 W32 · 基准指数100</span></div>
    <div className="forecast-summary"><article><small>模拟需求指数</small><strong>128</strong><em>较基准 +28</em></article><article><small>模拟供给指数</small><strong>96</strong><em>较基准 -4</em></article><article><small>供需健康度</small><strong>75</strong><em className="risk">演示阈值 85</em></article><article><small>待应对场景</small><strong>3</strong><em className="risk">需提前配置</em></article></div>
    <div className="forecast-content">
      <section className="forecast-chart"><div className="forecast-title"><div><b>未来7天模拟供需趋势</b><small>基准值100 · 需求指数 / 供给指数</small></div><div className="forecast-legend"><span className="demand-dot" />需求 <span className="supply-dot" />供给</div></div><div className="forecast-bars">{days.map(([day, demand, supply]) => <div className="forecast-day" key={String(day)}><div className="bar-pair"><i className="demand-bar" style={{ height: `${demand}%` }} /><i className="supply-bar" style={{ height: `${supply}%` }} /></div><small>{day}</small></div>)}</div><div className="forecast-callout"><span>AI</span><p><b>周五起模拟需求指数超过供给</b><small>建议优先应对场站返程与夜间休闲两类场景</small></p></div></section>
      <section className="forecast-issues"><div className="forecast-title"><div><b>本周应对问题</b><small>按风险优先级排序</small></div></div>{issues.map((issue) => <article key={issue.title}><span className={`risk-level level-${issue.level}`}>{issue.level}</span><div><h4>{issue.title}</h4><p>{issue.detail}</p><strong>{issue.metric}</strong></div><button onClick={() => onCreate(issue.template)}>生成策略 →</button></article>)}</section>
    </div>
  </div>;
}

function ProductionMaterials() {
  const audiences = [
    ["夜间活跃服务者", "4,820人", "夜间出车率 68%"], ["早高峰活跃服务者", "6,240人", "早峰出车率 74%"],
    ["场站候客服务者", "2,860人", "场站响应率 71%"], ["周末兼职服务者", "8,350人", "周末激活率 42%"],
    ["东部片区服务者", "3,160人", "区域覆盖率 83%"], ["近期沉默可召回", "5,470人", "预计召回率 18%"],
  ];
  const budgets = [["暑期供需保障包", "¥800,000", "68%", "24条", "ROI 2.6"], ["场站专项预算包", "¥500,000", "43%", "16条", "ROI 2.3"], ["夜间场景预算包", "¥350,000", "31%", "11条", "ROI 2.8"]];
  return <div className="strategy-alt-view"><div className="alt-heading"><div><span className="step-no">01</span><div><h3>人群资料库</h3><p>可复用的人群资产，生成策略时直接调用</p></div></div><button>＋ 新建人群</button></div><div className="audience-grid">{audiences.map((item) => <article key={item[0]}><span className="audience-icon">人</span><h4>{item[0]}</h4><strong>{item[1]}</strong><small>{item[2]}</small><em>可调用</em></article>)}</div><div className="alt-heading budget-heading"><div><span className="step-no">02</span><div><h3>预算包进度</h3><p>实时查看预算消耗与历史策略效率</p></div></div></div><div className="budget-grid">{budgets.map((item) => <article key={item[0]}><div><h4>{item[0]}</h4><span>{item[4]}</span></div><strong>{item[1]}</strong><small>已使用 {item[2]} · 已生产 {item[3]}策略</small><div className="budget-progress"><i style={{ width: item[2] }} /></div></article>)}</div></div>;
}

function StrategyTasks() {
  const tasks = [
    ["周末机场与大学城保障", "08-08 16:30", "12,600人", "¥286,000", "26%", "62%", "+8,460", "2.4"],
    ["夜间娱乐场景激活", "08-07 18:20", "8,420人", "¥168,000", "31%", "58%", "+5,210", "2.8"],
    ["工作日早高峰通勤", "08-05 21:10", "15,300人", "¥325,000", "22%", "71%", "+9,180", "2.5"],
    ["场站雨天专项保障", "08-03 17:40", "6,850人", "¥142,000", "34%", "67%", "+4,760", "2.9"],
  ];
  return <div className="strategy-alt-view"><div className="view-summary strategy-summary"><div><small>累计创建策略</small><strong>1,500+</strong></div><div><small>覆盖使用团队</small><strong>100+</strong></div><div><small>平均领取率</small><strong>28.4%</strong></div><div><small>团队日均提效</small><strong>1.5h+</strong></div></div><div className="operations-card"><div className="operations-title"><div>策略任务效果汇总</div><span>近30日</span></div><div className="strategy-task-table"><table><thead><tr><th>策略名称</th><th>创建时间</th><th>覆盖人群</th><th>预算</th><th>领取率</th><th>出车率</th><th>增量订单</th><th>ROI</th></tr></thead><tbody>{tasks.map((row) => <tr key={row[0]}>{row.map((cell, i) => <td key={cell} className={i > 3 ? "positive-cell" : ""}>{cell}</td>)}</tr>)}</tbody></table></div></div></div>;
}

const capabilityCards = [
  ["01", "从业务问题出发", "先识别高频、重复且错误成本高的环节，再判断AI介入的价值。"],
  ["02", "把经验变成规则", "将隐性判断拆成数据输入、阈值、决策逻辑、约束和结构化输出。"],
  ["03", "用产品承载能力", "从个人Skill迭代到可配置、可校验、可规模复用的产品Demo。"],
  ["04", "保留人的判断", "AI处理重复工作与风险检查，运营负责策略设计、归因和最终审核。"],
];

function HomePreview() {
  const [mode, setMode] = useState<"supply" | "strategy">("supply");
  const [insightStep, setInsightStep] = useState(0);
  const insights = [
    { label: "01 需求感知", title: "人群需求异常升温", detail: "强降雨下，2处热区需求溢出 +38.6%" },
    { label: "02 AI 决策", title: "计算供给缺口与来源", detail: "缺口70人 · 匹配西岸商务区车辆" },
    { label: "03 调度执行", title: "把合适的车调向需求", detail: "已生成任务 · 预计18分钟抵达" },
  ];
  useEffect(() => {
    if (mode !== "supply") return;
    const timer = window.setInterval(() => setInsightStep((step) => (step + 1) % insights.length), 2200);
    return () => window.clearInterval(timer);
  }, [mode, insights.length]);
  return <div className="home-preview">
    <div className="preview-switch"><button className={mode === "supply" ? "active" : ""} onClick={() => setMode("supply")}><span>作品一</span>实时供需盯盘</button><button className={mode === "strategy" ? "active" : ""} onClick={() => setMode("strategy")}><span>作品二</span>策略中心</button></div>
    <div className={`preview-canvas ${mode}`}>
      {mode === "supply" ? <>
        <div className="preview-top"><span className="live-dot" />实时供需扫描 <em>强降雨模拟中</em><VirtualDataBadge /></div>
        <div className={`decision-network insight-step-${insightStep}`}>
          <span className="network-line line-car" /><span className="network-line line-person" />
          <span className="signal-packet packet-person" /><span className="signal-packet packet-car" />
          <div className="network-node car-node"><i>车</i><b>供给车辆</b></div>
          <div className="network-node hub-node"><i>AI</i><b>智能调度中枢</b><small>感知 · 匹配 · 执行</small></div>
          <div className="network-node person-node"><i>人</i><b>出行需求</b></div>
          <div className="demand-wave wave-one" /><div className="demand-wave wave-two" />
        </div>
        <button className="preview-ai-card" onClick={() => setInsightStep((insightStep + 1) % insights.length)} aria-label="查看下一步AI决策"><small>{insights[insightStep].label}</small><strong>{insights[insightStep].title}</strong><span>{insights[insightStep].detail}</span><em>{String(insightStep + 1).padStart(2, "0")} / 03 →</em></button>
        <div className="preview-flow"><span className={insightStep === 0 ? "active" : ""}>需求感知</span><i>→</i><span className={insightStep === 1 ? "active" : ""}>AI缺口计算</span><i>→</i><span className={insightStep === 2 ? "active" : ""}>车辆匹配调度</span></div>
      </> : <>
        <div className="preview-top"><span className="ai-star">✦</span>策略中心 <em>自然语言 → 执行策略</em><VirtualDataBadge /></div>
        <div className="strategy-animation">
          <div className="prompt-bubble"><small>一句话策略</small><p>为机场周末兼职服务者配置晚高峰阶梯奖励…</p><i className="typing-cursor" /></div>
          <div className="flow-arrow">→</div>
          <div className="generated-stack"><span>策略 01</span><span>策略 02</span><span>策略 03</span><em>批量生成 6 条</em></div>
          <div className="flow-arrow">→</div>
          <div className="validation-mini"><i>✓</i><b>校验通过</b><small>话术已生成</small></div>
        </div>
        <div className="strategy-outcomes"><span><small>覆盖人群</small><b>12,600</b></span><span><small>预计订单增量</small><b>+8,460</b></span><span><small>预计ROI</small><b>2.4</b></span></div>
        <div className="preview-flow"><span>一句话输入</span><i>→</i><span>批量生成</span><i>→</i><span>自动校验</span><i>→</i><span>话术推送</span></div>
      </>}
    </div>
  </div>;
}

function Footer() {
  return <footer><BrandMark /><p>AI产品运营 · AI产品经理 · AI解决方案</p><span>Portfolio demo · 2026</span></footer>;
}

export function HomePage() {
  return (
    <main>
      <SiteHeader active="home" />

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow orange-text">AI PRODUCT PRACTICE · 2026</div>
          <h1 className="hero-statement"><span className="hero-key business-key">复杂业务</span><i>+</i><span className="hero-key ai-key">AI产品</span><small>把六年运营经验，炼成可执行的产品能力。</small></h1>
          <p>6年出行平台运营专家｜AI产品实践者<br />目标方向：AI产品运营 · AI产品经理 · AI解决方案</p>
          <div className="hero-actions"><a className="primary-cta" href="/supply">体验作品一 <ArrowIcon /></a><a className="secondary-cta" href="/strategy">体验作品二</a></div>
        </div>
        <div className="hero-product">
          <div className="hero-glow" />
          <HomePreview />
        </div>
      </section>

      <section className="stats portfolio-stats" aria-label="项目成果">
        <div><strong>300<sup>+</sup></strong><span>作品一 · 使用人数</span></div>
        <div><strong>20<sup>×</sup></strong><span>作品一 · 监控频率提升</span></div>
        <div><strong>100<sup>+</sup></strong><span>作品二 · 覆盖人数</span></div>
        <div><strong>1500<sup>+</sup></strong><span>作品二 · 创建策略</span></div>
        <div><strong>1.5<sup>h+</sup></strong><span>作品二 · 团队日均提效</span></div>
      </section>

      <section className="home-work">
        <div className="work-intro compact"><div><span className="eyebrow orange-text">SELECTED WORK</span><h2>两个作品，<br /><em>两条AI产品执行链路。</em></h2></div><p>两个项目均源于DD真实业务实践，并重新设计为完全脱敏的交互Demo。所有城市、数据、字段和流程均为虚拟演示内容。</p></div>
        <div className="home-project-grid">
          <a href="/supply" className="home-project-card supply-card"><div><span>作品一 · REAL-TIME OPERATIONS</span><VirtualDataBadge /><h3>智能供需监控台</h3><p>实时扫描供需、发现洼地、计算缺口并一键推送调度。</p></div><div className="card-visual supply-visual"><div className="mini-kpis"><span><small>需求指数</small><b>126</b></span><span><small>在线供给</small><b>2,864</b></span><span><small>风险区域</small><b>2</b></span></div><div className="mini-city-map"><i className="mini-road r1" /><i className="mini-road r2" /><span className="mini-heat orange" /><span className="mini-heat blue" /><span className="mini-heat orange second" /><em className="mini-scan" /></div><b>AI实时扫描 · 缺口70人</b></div><strong>每日4次 → 全天候分钟级扫描 <ArrowIcon /></strong></a>
          <a href="/strategy" className="home-project-card strategy-card"><div><span>作品二 · AI WORKFLOW</span><VirtualDataBadge /><h3>策略中心</h3><p>从供需预测识别问题，到策略生产、质检与效果复盘。</p></div><div className="card-visual strategy-visual"><div className="mini-forecast-card"><small>本周供需预测</small><b>3项风险</b><span><i style={{ height: "45%" }} /><i style={{ height: "62%" }} /><i style={{ height: "82%" }} /><i style={{ height: "70%" }} /></span></div><em>→</em><div className="mini-policy-card"><small>策略车间</small><span>场站返程保障</span><span>夜间休闲激活</span><b>质检 92分</b></div><b>预测 → 生产 → 复盘</b></div><strong>1500+ 策略 · 日均提效1.5h+ <ArrowIcon /></strong></a>
        </div>
      </section>

      <section className="about-teaser"><div><span className="eyebrow">ABOUT THIS PORTFOLIO</span><h2>真实问题，虚拟数据，<br />完整呈现产品思考。</h2></div><a href="/about">了解项目方法与脱敏说明 <ArrowIcon /></a></section>
      <Footer />
    </main>
  );
}

export function SupplyPage() {
  return <main><SiteHeader active="supply" /><section className="page-hero light-page"><div><span className="page-kicker">作品一 · 供需盯盘</span><h1>智能供需监控台</h1><p>通过定时自动盯盘代替人工监控，实时扫描城市供需，快速识别供需洼地、计算供给缺口，并一键创建调度任务和推送群消息。</p></div><div className="page-proof"><span><strong>20×</strong>监控频率提升</span><span><strong>24h</strong>全天候扫描</span><span><strong>1min</strong>最快监控间隔</span></div></section><section className="project-section supply-project refreshed"><div className="project-heading"><div><span className="project-number big">作品一</span><div><div className="eyebrow">REAL-TIME OPERATIONS</div><h2>把实时AI分析，<br />变成快速响应的执行链路。</h2></div></div><p>从人工20分钟/次、每日4次的定时盯盘，升级为1分钟/次、24小时不间断自动扫描，监控频率提升20倍，更快发现并响应供需异常。</p></div><SupplyDemo /><DemoDataNotice /><div className="project-footnotes"><span><b>分钟级监控</b>从每日4次人工盯盘，升级为24小时不间断自动扫描。</span><span><b>快速响应</b>识别供不应求区域、计算缺口、推荐调度来源并创建任务。</span><span><b>结果闭环</b>创建后即时呈现任务、推送范围与执行状态。</span></div></section><Footer /></main>;
}

export function StrategyPage() {
  return <main><SiteHeader active="strategy" /><section className="page-hero strategy-page-hero"><div><span className="page-kicker">作品二 · 策略中心</span><h1>策略中心</h1><p>将供需预测识别出的经营问题，转换为可预测、可校验、可执行的结构化策略，让AI承担重复配置，让运营保留最终判断。</p></div><div className="page-proof"><span><strong>100+</strong>覆盖人数</span><span><strong>1500+</strong>累计创建策略</span><span><strong>1.5h+</strong>团队日均提效</span></div></section><section className="project-section strategy-project refreshed"><div className="project-heading"><div><span className="project-number big">作品二</span><div><div className="eyebrow neon-text">INTELLIGENT MOBILITY</div><h2>先预测本周问题，再生产、质检与复盘策略。</h2></div></div><p>先在供需预测中查看本周风险并生成应对策略，再进入策略车间、生产资料与任务复盘，查看完整执行链路。</p></div><StrategyDemo /><DemoDataNotice /><div className="project-footnotes"><span><b>供需预测驱动</b>提前识别本周场站、夜间与通勤场景的供需问题。</span><span><b>生产资料复用</b>沉淀人群资产和预算包，降低重复输入与错配风险。</span><span><b>任务效果闭环</b>统一汇总策略状态、转化漏斗、增量订单与投入产出。</span></div></section><Footer /></main>;
}

export function AboutPage() {
  return <main><SiteHeader active="about" /><section className="about-page"><div className="about-page-heading"><span className="eyebrow orange-text">ABOUT THIS PORTFOLIO</span><h1>真实问题，虚拟数据，<br /><em>完整呈现产品思考。</em></h1><p>这是张唯用于求职展示的个人AI作品集，重点呈现复杂出行业务如何被重新拆解为可执行、可校验、可复用的AI产品。</p></div><div className="capability-grid">{capabilityCards.map(([no, title, desc]) => <article key={no}><span>{no}</span><h3>{title}</h3><p>{desc}</p></article>)}</div><div className="timeline-card"><div><span>Skill原型</span><small>验证单点价值</small></div><i>→</i><div><span>用户反馈</span><small>识别复用障碍</small></div><i>→</i><div><span>App产品化</span><small>配置与自动运行</small></div><i>→</i><div><span>全链路协同</span><small>生成、质检与决策</small></div></div><section className="privacy-note"><div><h2>关于职责与脱敏</h2><p>两个项目均由本人完成业务诊断、产品方案、规则抽象、Demo开发和迭代推广。作品集公开姓名，不展示手机号、邮箱、头像及当前公司信息。</p></div><div><h2>演示数据说明</h2><p>项目源于出行运营场景的真实实践抽象重构，不包含内部系统页面、接口和真实经营数据。“海川市”、人员、人群、策略、预算及地图均为虚构内容。</p></div></section></section><Footer /></main>;
}

export default HomePage;
