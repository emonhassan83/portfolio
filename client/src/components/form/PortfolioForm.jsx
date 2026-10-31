import {
    FormProvider,
    useForm,
  } from "react-hook-form";
  
  const PortfolioForm = ({
    onSubmit,
    children,
    defaultValues,
    resolver,
  }) => {
    const fromConfig = {};
    if (defaultValues) {
      fromConfig["defaultValues"] = defaultValues;
    }
  
    if (resolver) {
      fromConfig["resolver"] = resolver;
    }
  
    const methods = useForm(fromConfig);
  
    const submit = (data) => {
      onSubmit(data);
      methods.reset();
    };
  
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submit)}>
          {children}
        </form>
      </FormProvider>
    );
  };
  
  export default PortfolioForm;
  