import Link from "next/link";
import { cards } from "@/constants/cards";
import { buttons } from "@/constants/buttons";

export default function StaffHomeMenu({ menu }) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menu.map((item) => (
                <div key={item.href} className={cards.staffHome.menu}>
                    <div>
                        <div
                            className={`${cards.staffHome.menuIcon} ${item.iconStyle}`}
                        >
                            <span className="material-symbols-outlined text-4xl">
                                {item.icon}
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-3">
                            {item.title}
                        </h3>

                        <p className="text-slate-500 leading-relaxed">
                            {item.description}
                        </p>
                    </div>

                    <div className="mt-auto pt-8">
                        <Link
                            href={item.href}
                            className={buttons.staffHome.menuLink}
                        >
                            {item.action}
                            <span className="material-symbols-outlined text-lg">
                                arrow_forward
                            </span>
                        </Link>
                    </div>
                </div>
            ))}
        </section>
    );
}