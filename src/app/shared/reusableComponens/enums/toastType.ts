export enum TOAST_TYPES {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning'
}

export enum MODALCSS {
    CENTER = 'modal-dialog-centered',
    DEFAULT_SMALL ='flexModal modal-dialog modal-sm d-flex justify-content-center modal-dialog-centered'
}



export interface initialState {
  title:string,
  msg:string,
  popUpType:string,
  data:any
}

export const motivationalMessages = [
  "Great job! 🎉 You're one step closer to mastering this subject. Keep going! 🚀",
  "Awesome work! 💪 Let’s tackle the next challenge and stay ahead! 🏆",
  "You're on fire 🔥! Keep pushing and outperform the rest! ⚡",
  "Fantastic effort! 🌟 Every task you complete makes you stronger.",
  "Nice! 😎 Consistency is your superpower. On to the next task! 🚀",
  "Well done! 👏 Champions don’t stop—let’s keep the streak alive! 🔥",
  "You nailed it! 🎯 Time to level up with the next task. ⬆️",
  "Impressive work! 💯 Stay focused and keep climbing the leaderboard. 📈",
  "Boom! 💥 Another task completed. You're building momentum! 🚀",
  "Excellent! 🥇 Small wins like this lead to big success. 🌟",
  "You're doing amazing! 🤩 Don’t slow down—next task awaits. ⏳",
  "Keep it up! 💪 Every completed task puts you ahead of others. 🏁",
  "Brilliant! 🧠 You're proving what dedication can achieve. 🌟",
  "Victory! 🏆 Now let’s aim even higher with the next task. 🚀",
  "You’re unstoppable! 🔥 Keep learning, keep winning! 🎯"
];