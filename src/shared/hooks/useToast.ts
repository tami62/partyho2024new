import { useCallback, useMemo } from "react";
import Swal from "sweetalert2";

export const useToast = () => {
  const toast = useMemo(() => {
    const toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
    });
    return toast;
  }, []);

  const displayToast = useCallback(
    (status: "success" | "error", message: string) => {
      toast.fire({
        icon: status,
        title: message,
        padding: "10px 20px",
      });
    },
    [toast]
  );

  return {
    displayToast,
  };
};
