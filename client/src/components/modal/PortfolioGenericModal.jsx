import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const PortfolioModal = ({ closeModal, isOpen, title, children}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <button
                  type="button"
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                >
                  <span className="sr-only">Close</span>
                  &#x2715;
                </button>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mt-3 mb-6"
                >
                 {title}
                </Dialog.Title>

                {/* Content here */}
                {children}

                {/* <UpdateProjectModalData
                  project={project}
                  closeModal={closeModal}
                /> */}
                
                {/* Checkout form */}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PortfolioModal;
