import { cn } from "@reactive-resume/utils";

type Props = {
    title?: React.ReactNode;
    description?: React.ReactNode;
    start?: React.ReactNode;
    end?: React.ReactNode;
    className?: string;
    onClick?: () => void;
};

export const ListUser = ({ title, description, start, end, className, onClick }: Props) => (
    <div
        onClick={onClick}
        className={cn(
            "flex cursor-pointer items-center rounded p-4 transition-colors hover:bg-secondary/30",
            className,
        )}
    >
        hahaha
    </div>
);
