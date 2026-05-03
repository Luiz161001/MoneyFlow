interface PageHeadingProps {
    title: string;
    subtitle: string;
    classModifier: string
}

export function PageHeading({ title, subtitle, classModifier }: PageHeadingProps) {
    return (
        <div className={classModifier}>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted mt-1">{subtitle}</p>
        </div>
    );
}