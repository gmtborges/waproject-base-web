import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormValidation from '@react-form-fields/material-ui/components/FormValidation';
import FieldText from '@react-form-fields/material-ui/components/Text';
import ErrorMessage from 'components/Shared/ErrorMessage';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import useModel from 'hooks/useModel';
import IOrder from 'interfaces/models/order';
import React, { forwardRef, Fragment, memo, useCallback, useState } from 'react';
import { useCallbackObservable, useRetryableObservable } from 'react-use-observable';
import { of } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import orderService from 'services/order';
import userService from 'services/user';
import IUserRole from 'interfaces/models/userRole';

interface IProps {
  opened: boolean;
  order?: IOrder;
  onComplete: (order: IOrder) => void;
  onCancel: () => void;
}

const useStyle = makeStyles({
  content: {
    width: 400,
    maxWidth: 'calc(95vw - 50px)'
  },
  heading: {
    marginTop: 20,
    marginBottom: 10
  }
});

const OrderFormDialog = memo((props: IProps) => {
  const classes = useStyle(props);

  const [model, setModelProp, setModel, , clearModel] = useModel<IOrder>();
  const [loading, setLoading] = useState<boolean>(true);
  const [, rolesError, , retryRoles] = useRetryableObservable<Array<IUserRole>>(() => {
    setLoading(true);

    return userService.roles().pipe(
      tap(
        () => setLoading(false),
        () => setLoading(false)
      ),
      logError()
    );
  }, []);

  const handleEnter = useCallback(() => {
    setModel({ ...(props.order || {}) });
    retryRoles();
  }, [props.order, retryRoles, setModel]);

  const handleExit = useCallback(() => {
    clearModel();
  }, [clearModel]);

  const [onSubmit] = useCallbackObservable(
    (isValid: boolean) => {
      return of(isValid).pipe(
        filter(isValid => isValid),
        tap(() => setLoading(true)),
        switchMap(() => orderService.save(model as IOrder)),
        tap(
          order => {
            Toast.show(`Pedido ${order.description} foi salvo`);
            props.onComplete(order);
            setLoading(false);
          },
          err => {
            Toast.error(err);
            setLoading(false);
          }
        ),
        logError()
      );
    },
    [model]
  );

  return (
    <Dialog
      open={props.opened}
      disableBackdropClick
      disableEscapeKeyDown
      onEnter={handleEnter}
      onExited={handleExit}
      TransitionComponent={Transition}
    >
      {loading && <LinearProgress color='secondary' />}

      <FormValidation onSubmit={onSubmit}>
        <DialogTitle>Novo Pedido</DialogTitle>
        <DialogContent className={classes.content}>
          {rolesError && <ErrorMessage error={rolesError} tryAgain={retryRoles} />}

          {!rolesError && (
            <Fragment>
              <FieldText
                label='Descrição'
                disabled={loading}
                value={model.description}
                validation='required|min:3|max:255'
                onChange={setModelProp('description', (model, v) => (model.description = v))}
              />

              <FieldText
                label='Quantidade'
                type='number'
                disabled={loading}
                value={model.quantity}
                validation='required|integer'
                onChange={setModelProp('quantity', (model, v) => (model.quantity = Number(v)))}
              />

              <FieldText
                label='Valor'
                type='number'
                disabled={loading}
                value={model.value}
                validation='required|numeric'
                onChange={setModelProp('value', (model, v) => (model.value = Number(v)))}
              />
            </Fragment>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>Cancelar</Button>
          <Button color='primary' type='submit' disabled={loading || !!rolesError}>
            Salvar
          </Button>
        </DialogActions>
      </FormValidation>
    </Dialog>
  );
});

const Transition = memo(
  forwardRef((props: any, ref: any) => {
    return <Slide direction='up' {...props} ref={ref} />;
  })
);

export default OrderFormDialog;
