export const buttons = {
  common: {
    hotline:
      "flex items-center justify-center rounded-lg h-10 px-4 bg-red-500 text-white font-black shadow-lg hover:scale-105 transition-transform",

    hotlineSmall:
      "flex items-center justify-center rounded-lg h-9 px-6 bg-[#d64550] text-white text-sm font-bold hover:bg-red-700 transition-colors shadow-md shadow-red-500/20",
  },

  home: {
    staff:
      "flex items-center justify-center gap-3 rounded-xl h-14 px-10 bg-white/60 border-2 border-blue-100 hover:border-sky-500 hover:text-sky-500 transition-all group max-w-xs w-full shadow-sm backdrop-blur-sm",
  },

  selectRole: {
    emergency:
      "bg-[#d64550] hover:bg-red-700 text-white shadow-lg shadow-red-500/20",

    donation:
      "bg-[#0077b6] hover:bg-blue-800 text-white shadow-lg shadow-blue-500/20",
  },

  userLogin: {
    login:
      "block text-center w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-slate-800/20 transition-all active:scale-[0.98] mt-2",

    line:
      "w-full bg-[#06C755] hover:bg-[#05b54d] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]",

    register:
      "w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm",
  },

  userRegister: {
    register:
      "block text-center w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-slate-800/20 transition-all active:scale-[0.98] mt-4",

    line:
      "w-full bg-[#06C755] hover:bg-[#05b54d] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]",

    loginRedirect:
      "block w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm",
  },

  userHome: {
    sos:
      "flex items-center justify-center gap-3 bg-white text-red-500 hover:bg-red-50 px-8 py-5 rounded-xl font-bold text-xl shadow-lg transition-all hover:scale-105 active:scale-95 group border-2 border-white/20",

    floating:
      "w-14 h-14 bg-white shadow-xl shadow-sky-100 rounded-full flex items-center justify-center text-sky-500 hover:bg-sky-50 transition-colors border border-sky-50",
  },

  userSosForm: {
    submit:
      "w-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-sky-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3",

    confirm:
      "w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2",

    cancel:
      "w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl transition-colors",
  },

  userChatBot: {
    hotline:
      "bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md shadow-red-500/20 transition-all inline-flex items-center gap-2",

    menuActive:
      "flex items-center gap-3 px-4 py-3 bg-white text-blue-700 font-bold rounded-xl shadow-sm border-l-4 border-blue-600 transition-all",

    menu:
      "flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-white hover:text-slate-700 font-medium rounded-xl transition-all",

    headerIcon:
      "w-10 h-10 rounded-full hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-center",

    inputIcon:
      "w-9 h-9 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors",

    send:
      "w-10 h-10 bg-blue-800 hover:bg-blue-900 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95 ml-2",
  },

  userSosTracking: {
    hotline:
      "bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md shadow-red-500/20 transition-all inline-flex items-center gap-1.5",

    call:
      "ml-auto w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-green-600 transition-colors",

    contact:
      "block w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-800/20 transition-all active:scale-[0.98] text-center flex items-center justify-center gap-2",
  },

  userSosHistory: {
    tracking:
      "inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-sky-200 transition-all hover:-translate-y-0.5",

    detail:
      "text-slate-400 hover:text-slate-600 text-sm font-medium underline decoration-slate-300 underline-offset-4",

    more:
      "text-slate-400 hover:text-sky-500 text-sm font-medium transition-colors",
  },

  userSosSuccess: {
    tracking:
      "block w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-sky-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2",

    home:
      "block w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2",
  },

  donorHome: {
    primary:
      "bg-white text-sky-600 font-black px-12 py-5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-xl",

    notify:
      "relative flex items-center justify-center text-[#0c4a6e] hover:text-sky-500 transition-colors p-2 rounded-full hover:bg-blue-50",
  },

  donorForm: {
    submit:
      "w-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-sky-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-8",

    back:
      "inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium mb-6 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 transition-all hover:shadow-md",

    map:
      "block w-full bg-white border border-sky-200 text-sky-600 text-center py-2.5 rounded-lg text-sm font-bold hover:bg-sky-50 transition-colors shadow-sm",
  },

  donorSuccess: {
    saveTicket:
      "w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2",

    trackingLink:
      "block w-full text-center text-xs text-sky-500 hover:underline mt-2 font-medium",
  },

  donorTracking: {
    map:
      "inline-flex items-center gap-2 bg-white border border-orange-200 text-orange-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors shadow-sm",

    contact:
      "w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm",
  },

  donorLowProducts: {
    primary:
      "block w-full text-center font-bold py-2.5 rounded-xl transition-colors active:scale-95",

    filterActive:
      "whitespace-nowrap px-4 py-2 bg-sky-600 text-white rounded-full text-sm font-bold shadow-md shadow-sky-200 hover:bg-sky-700 transition-all",

    filter:
      "whitespace-nowrap px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600 rounded-full text-sm font-medium transition-all",
  },

  donorHistory: {
    tracking:
      "inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-sky-200 transition-all hover:-translate-y-0.5",

    detail:
      "text-slate-400 hover:text-slate-600 text-sm font-medium underline decoration-slate-300 underline-offset-4",

    more:
      "text-slate-400 hover:text-sky-500 text-sm font-medium transition-colors",
  },

  staffHome: {
    hero:
      "inline-flex items-center gap-3 bg-white hover:bg-blue-50 text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all hover:scale-105 active:scale-95 group",

    menuLink:
      "inline-flex items-center gap-2 text-blue-600 font-bold group-hover:gap-3 transition-all",
  },

  staffLogin: {
    login:
      "block text-center w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-slate-800/20 transition-all active:scale-[0.98] mt-2",

    line:
      "w-full bg-[#06C755] hover:bg-[#05b54d] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]",

    registerLink:
      "w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm",
  },

  staffRegister: {
    register:
      "block text-center w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-slate-800/20 transition-all active:scale-[0.98] mt-4",

    loginRedirect:
      "block w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm",
  },

  staffSos: {
    tab:
      "px-4 py-2 rounded-lg text-sm font-bold border border-transparent transition-all whitespace-nowrap",

    tabActive:
      "bg-slate-800 text-white border-slate-800",

    tabInactive:
      "text-slate-600 hover:bg-slate-50",

    acceptJob:
      "bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2",

    gps:
      "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2",
  },
  staffMissionActive: {
    back:
      "mr-4 text-white/80 hover:text-white transition-colors p-1 active:scale-95",
    map:
      "absolute bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-xl transition-transform hover:scale-110 flex items-center justify-center w-14 h-14 z-10",
    call:
      "bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center shadow-sm hover:bg-green-200 transition-colors",
    checkin:
      "w-full bg-slate-50 border border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-slate-100",
    checked:
      "w-full bg-green-50 border border-green-200 text-green-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2",
    proof:
      "w-full border-2 border-dashed border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group",
    closeMission:
      "block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/30 transition-all text-center flex items-center justify-center gap-2",
  },
  staffVerify: {
    search:
      "w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-sky-900/50 transition-all active:scale-95 flex items-center justify-center gap-2",

    action:
      "w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2",
  },

  staffVerifyData: {
    cancel:
      "flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3.5 rounded-xl transition-colors",

    submit:
      "flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-900/50 transition-all active:scale-95 flex items-center justify-center gap-2",
  },

  staffVerifySuccess: {
    next:
      "block w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-sky-900/50 transition-all active:scale-95",

    home:
      "bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center",
  },

  staffMap: {
    back:
      "bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-bold transition-all",

    accept:
      "bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded text-center",

    detail:
      "bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2 rounded text-center",
  },

  staffInventory: {
    tab:
      "px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all",

    tabActive:
      "bg-slate-800 text-white shadow-md",

    tabInactive:
      "text-slate-500 hover:bg-slate-100",
  },
};