import { Breadcrum } from "@/client/router/loaders/group";
import { Button } from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { ArrowLeft } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

type Props = {
  breadcrums?: Breadcrum[]
  className?: string;
};

export const Breadcrums = ({ breadcrums, className }: Props) => {
  const navigate = useNavigate();

  return <div
    className={cn(
      "flex cursor-pointer items-center rounded",
      className,
    )}
  >
    <div className="flex w-full items-center justify-between">
      <ul className="flex items-center space-x-4">
        <Button size="icon" variant="ghost" onClick={() => navigate(-1)}  >
          <ArrowLeft size={20} />
        </Button>
        {
          breadcrums?.map(breadcrum =>
            <li key={breadcrum.id} className="truncate font-bold text-base p-4 transition-colors"
            >
              {breadcrum.name}
            </li>)
        }
      </ul>
    </div>
  </div>
}
  ;
