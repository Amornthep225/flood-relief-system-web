export default function UserFilterBar({ searchText, setSearchText }) {
    return (
        <section className="bg-white p-4 rounded-t-2xl border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-grow">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">
                        search
                    </span>

                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..."
                        className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                </div>
            </div>
        </section>
    );
}