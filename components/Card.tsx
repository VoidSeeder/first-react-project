import { ReactNode } from "react";

type CardProps = {
    title?: string;
    children?: ReactNode | ReactNode[];
};

export default function Card({ title, children }: CardProps) {
    return (
        <div className="bg-white rounded-xl p-4 h-fit w-fit">
            {title && (
                <>
                    <div className="w-fit mx-auto">{title}</div>
                    <div className="h-[1px] -mx-4 bg-black my-2" />
                </>
            )}
            {children ?? null}
        </div>
    );
}
