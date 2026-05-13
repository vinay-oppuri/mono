"use client"

import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { authClient } from "@/lib/auth-client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { PricingCard } from "../components/pricing-card"

type Product = {
    id: string
    name: string
    description: string
    metadata: {
        badge?: string
        variant?: string
    }
    prices: {
        amountType: "fixed" | "variable"
        priceAmount: number
        recurringInterval: string
    }[]
    benefits: {
        description: string
    }[]
}


export const UpgradeView = () => {
    const trpc = useTRPC()
    const { data: products } = useSuspenseQuery(
        trpc.premium.getProducts.queryOptions()
    ) as { data: Product[] }

    const { data: currentSubscription } = useSuspenseQuery(
        trpc.premium.getCurrentSubscription.queryOptions()
    )

    return (
        <div className="flex flex-1 flex-col gap-y-8 px-4 py-6 pb-24 md:px-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-y-8">
                <div className="rounded-lg border bg-card p-6 text-center shadow-sm">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wide text-primary">Plans</p>
                    <h5 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                        You are on the{" "}
                        <span className="text-chart-5">
                            {currentSubscription?.name ?? "Free"}
                        </span>{" "}
                        plan
                    </h5>
                    <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                        Upgrade when you need more agents, more conversations, or room for heavier workflows.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {products.map((product) => {
                        const isCurrentProduct = currentSubscription?.id === product.id
                        const isPremium = !!currentSubscription

                        let buttonText = "Upgrade"
                        let onClick = () => authClient.checkout({ products: [product.id] })

                        if (isCurrentProduct) {
                            buttonText = "Manage"
                            onClick = () => authClient.customer.portal()
                        } else if (isPremium) {
                            buttonText = "Change Plan"
                            onClick = () => authClient.customer.portal()
                        }

                        return (
                            <PricingCard
                                key={product.id}
                                buttonText={buttonText}
                                onClick={onClick}
                                variant={
                                    product.metadata.variant === "highlighted" ? "highlighted" : "default"
                                }
                                title={product.name}
                                price={
                                    product.prices[0].amountType === "fixed" ? product.prices[0].priceAmount / 100 : 0
                                }
                                description={product.description}
                                priceSuffix={`/${product.prices[0].recurringInterval}`}
                                features={product.benefits.map((benefit: { description: string }) => benefit.description)}
                                badge={product.metadata.badge as string | null}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export const UpgradeViewLoading = () => {
    return (
        <LoadingState
            title="Loading"
            description="This may take a few seconds"
        />
    )
}

export const UpgradeViewError = () => {
    return (
        <ErrorState
            title="Error"
            description="Please try again later"
        />
    )
}
