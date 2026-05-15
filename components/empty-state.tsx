import Image from "next/image";

interface Props {
    title: string
    description: string
    image?: string
}

export const EmptyState = ({ title, description, image='/empty.svg' }: Props) => {

    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-foreground/5 bg-card px-6 py-12 shadow-sm">
            <Image src={image} alt="Empty State" width={220} height={220}/>
            <div className="mx-auto flex max-w-md flex-col gap-y-3 text-center">
                <h6 className="text-lg font-semibold">{title}</h6>
                <p className="text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}
