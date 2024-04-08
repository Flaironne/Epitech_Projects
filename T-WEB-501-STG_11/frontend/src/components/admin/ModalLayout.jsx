import {
  Modal as ModalNextUI,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Spinner,
  Spacer,
} from "@nextui-org/react";

export default function ModalLayout({
  children,
  title,
  onSubmit,
  submitting,
  ...props
}) {
  return (
    <ModalNextUI {...props} size="5xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{title()}</h2>
        </ModalHeader>
        {submitting ? (
          <>
            <Spinner size="lg" />
            <Spacer y={12} />
          </>
        ) : (
          <>
            <ModalBody>{children}</ModalBody>
            <div className="w-full flex gap-4 px-6 py-4">
              <Button
                variant="ghost"
                color="primary"
                onPress={onSubmit}
                className="flex-1 h-12"
              >
                Update
              </Button>
            </div>
          </>
        )}
      </ModalContent>
    </ModalNextUI>
  );
}
