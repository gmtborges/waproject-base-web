import FormValidation from '@react-form-fields/material-ui/components/FormValidation';
import React, { Component } from 'react';

export interface IStateForm<T extends Object = any> {
  model?: Partial<T>;
  formSubmitted?: boolean;
}

export abstract class FormComponent<P, S extends IStateForm> extends Component<P, S> {
  protected formValidationRef = React.createRef<FormValidation>();
  protected scrollTop: Function;

  constructor(props: any) {
    super(props);
    this.state = { model: {} } as Readonly<S>;
  }

  public bindScrollTop = (scrollTop: Function): React.ReactNode => {
    this.scrollTop = scrollTop;
    return null;
  }

  public isFormValid = () => {
    return this.formValidationRef.current.isValid();
  }

  public resetForm = () => {
    this.setState({ model: {}, formSubmitted: false });
    this.formValidationRef.current.reset();
  }

  protected updateModel = (handler: (model: S['model'], value: any) => void): (value: any) => void => {
    return (value: any) => {
      const { model } = this.state;

      handler(model, value);

      this.setState({ model });
    };
  }

}