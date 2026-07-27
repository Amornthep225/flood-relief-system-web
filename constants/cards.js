export const cards = {
    home: {
        actionWrapper:
            "bg-gradient-to-br from-white to-sky-50 border border-blue-100 p-3 md:p-4 rounded-[3rem] shadow-2xl shadow-blue-200/50",

        action:
            "group relative w-full flex flex-col items-center justify-center gap-6 p-12 md:p-20 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-xl hover:-translate-y-1 transition-all duration-300",

        actionIcon:
            "size-20 md:size-28 flex items-center justify-center bg-white/20 rounded-3xl backdrop-blur-md group-hover:scale-110 transition-transform duration-500 border border-white/30 shadow-lg",

        stat:
            "bg-sky-100/60 p-8 rounded-2xl border border-blue-200 shadow-md flex flex-col items-center text-center",

        statIcon:
            "size-14 rounded-full bg-white flex items-center justify-center text-blue-700 mb-4 shadow-sm",
    },

    selectRole: {
        roleBase:
            "group relative rounded-[2.5rem] p-12 md:p-16 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1",

        emergency:
            "bg-white shadow-[0_20px_50px_-12px_rgba(214,69,80,0.15)] border border-red-50/50",

        donation:
            "bg-white shadow-[0_20px_50px_-12px_rgba(0,119,182,0.15)] border border-blue-50/50",

        icon:
            "w-32 h-32 rounded-full flex items-center justify-center mb-10 transition-transform duration-300 group-hover:scale-105",
    },

    userLogin: {
        card:
            "bg-white w-full max-w-[420px] rounded-3xl shadow-2xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100",

        icon:
            "w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center text-sky-500 text-2xl shadow-inner",

        input:
            "w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-300 text-slate-700",
    },

    userRegister: {
        wrapper:
            "bg-white w-full max-w-[420px] rounded-3xl shadow-2xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100",

        icon:
            "w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center text-sky-500 text-2xl shadow-inner",

        input:
            "w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-300 text-slate-700",
    },

    userHome: {
    hero:
        "relative bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-8 md:p-12 overflow-hidden shadow-xl shadow-sky-200",

    menu:
        "bg-white p-8 rounded-2xl shadow-lg shadow-sky-100/50 border border-white flex flex-col min-h-[280px] hover:-translate-y-1 transition-all duration-300",
},

    userSosForm: {
        form:
            "bg-white rounded-3xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-100 p-6 md:p-10 space-y-10",

        category:
            "cursor-pointer group relative flex flex-col items-center p-5 rounded-2xl border-2 bg-slate-50/50 hover:border-sky-200 hover:bg-sky-50 transition-all select-none",

        itemGroup:
            "bg-white border border-slate-200 rounded-2xl p-5 shadow-sm",
    },

    userChatBot: {
        container:
            "w-full max-w-7xl bg-white rounded-3xl shadow-xl border border-slate-100 flex overflow-hidden",

        sidebar:
            "w-64 bg-slate-50 border-r border-slate-100 flex-col hidden md:flex",

        agentMessage:
            "bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 border border-slate-100",

        userMessage:
            "bg-blue-600 p-3.5 rounded-2xl rounded-tr-none shadow-md text-sm text-white leading-relaxed text-left",

        inputBox:
            "relative flex items-center bg-slate-50 rounded-2xl border border-slate-200 px-2 py-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all",
    },

    userSosTracking: {
        card:
            "bg-green-900 rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative",

        info:
            "mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3",

        map:
            "relative w-full h-48 bg-slate-200 rounded-2xl overflow-hidden shadow-inner border border-slate-200",

        timeline:
            "space-y-8 relative z-10",
    },

    userSosHistory: {
        summary:
            "bg-green-500 border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden",

        summaryPrimary:
            "bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200 relative overflow-hidden",

        card:
            "bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden hover:shadow-md transition-all",

        tag:
            "inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded text-xs text-slate-600",
    },

    userSosSuccess: {
        card:
            "bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center overflow-hidden relative",

        info:
            "bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200 border-dashed",

        summary:
            "flex items-start gap-3",

        icon:
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
    },

    donorHome: {
        hero:
            "relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-sky-500 p-8 md:p-14 mb-12 shadow-lg shadow-blue-200",

        menu:
            "group bg-white p-10 rounded-2xl border border-blue-100 shadow-sm hover:shadow-xl hover:border-sky-500/30 transition-all cursor-pointer flex flex-col",
    },

    donorForm: {
        form:
            "bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-10 space-y-8",

        category:
            "cursor-pointer group relative flex flex-col items-center p-5 rounded-2xl border-2 bg-slate-50/50 hover:border-sky-200 hover:bg-sky-50 transition-all select-none",

        itemGroup:
            "bg-white border border-slate-200 rounded-2xl p-5 shadow-sm",

        center:
            "bg-sky-50 border border-sky-100 rounded-2xl p-5 relative overflow-hidden",

        upload:
            "border-2 border-dashed border-slate-200 rounded-2xl h-40 flex flex-col items-center justify-center bg-slate-50 hover:bg-sky-50 hover:border-sky-300 transition-all cursor-pointer group",
    },

    donorSuccess: {
        ticket:
            "bg-white rounded-3xl shadow-xl overflow-hidden relative border border-slate-100",

        header:
            "bg-slate-800 p-8 text-center relative overflow-hidden",

        items:
            "bg-slate-50 rounded-xl p-4 border border-slate-100",

        itemRow:
            "flex justify-between items-center border-b border-slate-50 pb-2",
    },

    donorTracking: {
        card:
            "bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden",

        header:
            "bg-gradient-to-br from-sky-50 to-white p-8 border-b border-slate-100 text-center relative overflow-hidden",

        item:
            "flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm shrink-0",
    },

    donorLowProducts: {
        card:
            "bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300 group relative",

        image:
            "h-40 rounded-xl mb-4 overflow-hidden flex items-center justify-center relative",
    },

    donorHistory: {
        summaryPrimary:
            "bg-white/95 rounded-2xl border border-sky-200 p-6 text-slate-800 shadow-lg shadow-sky-900/10 relative overflow-hidden group hover:scale-[1.02] transition-transform",

        summary:
            "bg-white/95 rounded-2xl border border-sky-200 p-6 text-slate-800 shadow-lg shadow-sky-900/10 relative overflow-hidden group hover:scale-[1.02] transition-transform",

        card:
            "bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden hover:shadow-md transition-all",

        tag:
            "inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded text-xs text-slate-600",
    },

    staffHome: {
        hero:
            "relative bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-8 md:p-12 mb-10 overflow-hidden shadow-xl shadow-blue-500/20",

        menu:
            "bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full group transition-all hover:shadow-xl hover:-translate-y-1",

        menuIcon:
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
    },

    staffLogin: {
        card:
            "bg-white w-full max-w-[420px] rounded-3xl shadow-2xl shadow-slate-300/50 p-8 md:p-10 border border-slate-200",

        icon:
            "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 text-3xl shadow-inner",

        input:
            "w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all placeholder:text-slate-300 text-slate-700",
    },

    staffRegister: {
        card:
            "bg-white w-full max-w-[420px] rounded-3xl shadow-2xl shadow-slate-300/50 p-8 md:p-10 border border-slate-200",

        icon:
            "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 text-3xl shadow-inner",

        input:
            "w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all placeholder:text-slate-300 text-slate-700",
    },

    staffSos: {
        card:
            "bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 relative",

        modal:
            "hidden fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4",
    },
    staffMissionActive: {
        map: "relative h-60 bg-slate-200 w-full shrink-0 group",
        content:
            "flex-grow bg-white rounded-t-3xl -mt-6 relative z-10 shadow-lg px-6 py-8",
        note:
            "bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm text-slate-600 italic",
        supplyBox:
            "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
        supplyHeader:
            "bg-orange-50 px-4 py-3 border-b border-orange-100 flex justify-between items-center",
        supplyRow:
            "flex justify-between items-center p-3 hover:bg-slate-50",
    },
    staffVerify: {
        card:
            "bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden",

        result:
            "bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-600",
    },

    staffVerifyData: {
        panel:
            "bg-slate-800 rounded-xl border border-slate-700 shadow-sm",

        modal:
            "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4",
    },

    staffVerifySuccess: {
        card:
            "w-full max-w-sm bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl relative z-10 text-center",

        info:
            "bg-slate-900/50 rounded-2xl p-5 mb-8 border border-slate-700/50 text-left relative overflow-hidden",
    },

    staffMap: {
        sidebar:
            "w-72 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 flex flex-col",

        popup:
            "w-72 bg-white rounded-xl shadow-2xl border border-slate-100",

        summary:
            "bg-slate-50 rounded-xl p-3 border border-slate-200",
    },

    staffInventory: {
        stat:
            "px-4 py-3 rounded-xl border shadow-sm flex-1 md:flex-none",

        filter:
            "bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-2 sticky top-[70px] z-40",

        card:
            "bg-white rounded-2xl shadow-sm p-5 relative overflow-hidden hover:shadow-md transition-all group",
    },

    adminLayout: {
        sidebar:
            "w-64 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col shadow-sm z-20",
    },

    adminDashboard: {
        statCard:
            "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group",

        panel:
            "bg-white rounded-2xl border border-slate-100 shadow-sm",
    },
};
