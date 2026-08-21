"use client";

import { GameModal } from "../game-ui/GameModal";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function RankingRulesModal({ open, onClose }: Props) {
  return (
    <GameModal open={open} title="排行榜规则" subtitle="Rules" onClose={onClose}>
      <ul className="space-y-3 text-sm font-bold leading-relaxed text-[#5a4630]">
        <li>
          <span className="text-[var(--brand-deep)]">奖杯怎么来？</span>
          <br />
          完成挑战、对战获胜可获得各科目奖杯。不同科目的奖杯分开计算。
        </li>
        <li>
          <span className="text-[var(--brand-deep)]">排名怎么算？</span>
          <br />
          按当前筛选科目（或总奖杯）的奖杯数从高到低排列。奖杯相同则按胜场更多者优先。
        </li>
        <li>
          <span className="text-[var(--brand-deep)]">时间范围</span>
          <br />
          「总榜」为累计奖杯。「本周 / 本月 / 好友榜」界面已就绪，数据接入后会按周期刷新。
        </li>
        <li>
          <span className="text-[var(--brand-deep)]">平手怎么办？</span>
          <br />
          奖杯数相同：胜场多的排前面；仍相同则按昵称字母顺序。
        </li>
        <li>
          <span className="text-[var(--brand-deep)]">何时更新？</span>
          <br />
          挑战结算后即时更新本地排行。云端榜单将按周期同步。
        </li>
      </ul>
    </GameModal>
  );
}
