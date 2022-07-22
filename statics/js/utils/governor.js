
function voteState(state) {
  const code = Number(state)
  if (code === 1) {
    return {
      text: "同意票",
      code
    }
  } else if (code === 0) {
    return {
      text: "反对票",
      code
    }
  } else if (code === 2) {
    return {
      text: "弃权票",
      code
    }
  }
  return {
    text: "未设定",
    code
  }
}

function proposalState(state) {
  const code = Number(state)
  if (code === 0) {
    return {
      text: "未开始",
      en: "Pending",
      emoji: "⚪",
      code
    }
  } else if (code === 1) {
    return {
      text: "投票中",
      en: "Active",
      emoji: "🔵",
      code
    }
  } else if (code === 2) {
    return {
      text: "已取消",
      en: "Canceled",
      emoji: "❌",
      code
    }
  } else if (code === 3) {
    return {
      text: "不通过",
      en: "Defeated",
      emoji: "🔴",
      code
    }
  } else if (code === 4) {
    return {
      text: "投票通过",
      en: "Succeeded",
      emoji: "🟢",
      code
    }
  } else if (code === 5) {
    return {
      text: "已排程",
      en: "Queued",
      emoji: "⏸",
      code
    }
  } else if (code === 6) {
    return {
      text: "已过期",
      en: "Expired",
      emoji: "➖",
      code
    }
  } else if (code === 7) {
    return {
      text: "已执行",
      en: "Executed",
      emoji: "✅",
      code
    }
  }
  return {
    text: "",
    en: "",
    emoji: "",
    code
  }
}
