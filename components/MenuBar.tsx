import { useRouter } from "next/router";

type MenuItemType = {
    label: string;
    url: string;
};

export default function MenuBar() {
    const router = useRouter();

    const menuItemList: MenuItemType[] = [
        {
            label: "Aletas",
            url: "/fin",
        },
        {
            label: "Trocador Bitubular",
            url: "/bitubular",
        },
    ];

    return (
        <div className="h-16 bg-blue-900 flex gap-1 justify-around">
            {menuItemList.map((item, index) => (
                <div
                    className={`p-1 bg-white rounded-md cursor-pointer my-auto hover:outline hover:outline-red-500 ${
                        router.asPath == item.url
                            ? "outline outline-green-500"
                            : ""
                    }`}
                    key={index}
                    onClick={() => router.push(item.url)}
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
}
