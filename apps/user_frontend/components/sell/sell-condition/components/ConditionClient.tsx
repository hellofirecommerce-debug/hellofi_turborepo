"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { SelectedDeviceBar } from "./SelectedDeviceBar";
import { ConditionTabs } from "./ConditionTabs";
import { StepRenderer } from "./StepRenderer";
import { isStepComplete } from "./stepRules";
import { EvaluationSummary } from "./EvaluationSummary";
import { DynamicConditionModal } from "./DynamicConditionModal";

import { GET_USER_ASSESSMENT_FLOW } from "../../../../lib/graphql/queires/userAssessment.queries";
import { GET_ME } from "../../../../lib/graphql/queires/userAuth.queries";
import { CREATE_SELLING_ORDER } from "../../../../lib/graphql/mutations/userAuth.mutations";
import { AuthModal } from "../../../auth/AuthModal";

interface CreateSellingOrderResponse {
  createSellingOrder: {
    orderId: string;
    orderNo: string;
    orderLink: string;
    status: string;
    quote: {
      finalQuote: number;
    };
  };
}

interface CreateSellingOrderVars {
  input: {
    productId: string;
    variantId: string;
    answers: any[];
  };
}

interface Props {
  productId: string;
  variantId: string;
  categorySlug: string;
  brandSlug: string;
  productSlug: string;
  deviceName: string;
  image: string;
  changeHref: string;
}

export function ConditionClient({
  productId,
  variantId,
  categorySlug,
  brandSlug,
  productSlug,
  deviceName,
  image,
  changeHref,
}: Props) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const { data: userData, loading: authLoading } = useQuery<any>(GET_ME);
  const isLoggedIn = !!userData?.getUserMe;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPendingOrder, setIsPendingOrder] = useState(false);

  const [createOrder, { loading: creatingOrder }] = useMutation<
    CreateSellingOrderResponse,
    CreateSellingOrderVars
  >(CREATE_SELLING_ORDER);

  const [activePopup, setActivePopup] = useState<{
    conditions: any[];
    parentId: string;
  } | null>(null);

  const { data, loading } = useQuery<any>(GET_USER_ASSESSMENT_FLOW, {
    variables: { categorySlug, brandSlug, productSlug },
  });

  const steps = data?.getUserAssessmentFlow?.steps ?? [];
  const currentStep = steps[currentStepIndex];
  const stepDone = !!currentStep && isStepComplete(currentStep, answers);

  const handleOptionSelect = (
    conditionId: string,
    option: any,
    isMulti: boolean,
  ) => {
    setAnswers((prev) => {
      const current = prev[conditionId] || [];

      if (isMulti) {
        const updated = current.includes(option.id)
          ? current.filter((id) => id !== option.id)
          : [...current, option.id];
        return { ...prev, [conditionId]: updated };
      }

      if (option.isRedirect && option.redirectTo) {
        router.push(option.redirectTo);
        return prev;
      }

      if (option.popupConditions && option.popupConditions.length > 0) {
        setActivePopup({
          conditions: option.popupConditions,
          parentId: conditionId,
        });
      }

      return { ...prev, [conditionId]: [option.id] };
    });
  };

  const handlePopupSelect = (popupConditionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [popupConditionId]: [optionId],
    }));
  };

  const executeOrder = async () => {
    try {
      const formattedAnswers: any[] = [];
      steps.forEach((step: any) => {
        step.conditions.forEach((condition: any) => {
          const selectedOptions = answers[condition.id] || [];
          selectedOptions.forEach((optionId) => {
            formattedAnswers.push({
              stepId: step.id,
              conditionId: condition.id,
              optionId: optionId,
            });
          });
        });
      });

      const res = await createOrder({
        variables: {
          input: {
            productId,
            variantId,
            answers: formattedAnswers,
          },
        },
      });

      if (res.data?.createSellingOrder?.orderLink) {
        router.push(res.data.createSellingOrder.orderLink);
      }
    } catch (error: any) {
      toast.error(
        error.message || "Failed to calculate price. Please try again.",
      );
    }
  };

  const goNext = async () => {
    if (!stepDone) {
      toast.error("Please answer all required questions before continuing.");
      return;
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!isLoggedIn) {
      setIsPendingOrder(true);
      setIsAuthModalOpen(true);
      return;
    }

    executeOrder();
  };

  if (loading || authLoading)
    return <div className="py-20 text-center">Loading questions...</div>;
  if (!currentStep)
    return <div className="py-20 text-center">No assessment found.</div>;

  const isLast = currentStepIndex === steps.length - 1;

  return (
    <div className="mt-4 flex flex-col gap-5 pb-24 lg:pb-0">
      <SelectedDeviceBar
        name={deviceName}
        image={image}
        changeHref={changeHref}
      />

      <ConditionTabs
        steps={steps}
        activeIndex={currentStepIndex}
        onChange={setCurrentStepIndex}
        answers={answers}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="flex flex-col gap-6">
          <StepRenderer
            step={currentStep}
            stepIndex={currentStepIndex}
            stepCount={steps.length}
            answers={answers}
            onSelect={handleOptionSelect}
          />

          {/* fixed bottom bar on mobile, normal button on desktop */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:static lg:z-auto lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            <button
              type="button"
              onClick={goNext}
              disabled={!stepDone || creatingOrder}
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:bg-[#0057D9] disabled:cursor-not-allowed disabled:opacity-50 ${
                isLast ? "lg:w-56" : ""
              }`}
            >
              {creatingOrder
                ? "Calculating..."
                : isLast
                  ? "Get My Final Price"
                  : "Continue"}{" "}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <EvaluationSummary answers={answers} steps={steps} />
      </div>

      {activePopup && (
        <DynamicConditionModal
          parentTitle={
            currentStep.conditions.find(
              (c: any) => c.id === activePopup.parentId,
            )?.title || "Details"
          }
          popupConditions={activePopup.conditions}
          answers={answers}
          onSelect={handlePopupSelect}
          onClose={() => {
            const isComplete = activePopup.conditions.every(
              (popup: any) => (answers[popup.id] || []).length > 0,
            );

            if (!isComplete) {
              setAnswers((prev) => {
                const newAnswers = { ...prev };
                delete newAnswers[activePopup.parentId];
                return newAnswers;
              });
            }
            setActivePopup(null);
          }}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setIsPendingOrder(false);
        }}
        onSuccess={() => {
          if (isPendingOrder) {
            executeOrder();
            setIsPendingOrder(false);
          }
        }}
      />
    </div>
  );
}
