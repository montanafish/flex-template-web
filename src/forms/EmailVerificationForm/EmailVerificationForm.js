import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { reduxForm, Field, propTypes as formPropTypes } from 'redux-form';
import {
  Form,
  NamedLink,
  IconEmailAttention,
  IconEmailSuccess,
  PrimaryButton,
} from '../../components';
import { propTypes } from '../../util/types';

import css from './EmailVerificationForm.css';

const EmailVerificationFormComponent = props => {
  const { currentUser, inProgress, handleSubmit, verificationError } = props;

  const { email, emailVerified, pendingEmail, profile } = currentUser.attributes;
  const emailToVerify = <strong>{pendingEmail || email}</strong>;
  const name = profile.firstName;

  const errorMessage = (
    <div className={css.error}>
      <FormattedMessage id="EmailVerificationForm.verificationFailed" />
    </div>
  );

  const submitInProgress = inProgress;
  const submitDisabled = submitInProgress;

  const verifyEmail = (
    <div className={css.root}>
      <div>
        <IconEmailAttention className={css.modalIcon} />
        <h1 className={css.modalTitle}>
          <FormattedMessage id="EmailVerificationForm.verifyEmailAddress" />
        </h1>

        <p className={css.modalMessage}>
          <FormattedMessage
            id="EmailVerificationForm.finishAccountSetup"
            values={{ email: emailToVerify }}
          />
        </p>

        {verificationError ? errorMessage : null}
      </div>

      <Form onSubmit={handleSubmit}>
        <Field component="input" type="hidden" name="verificationToken" />

        <div className={css.bottomWrapper}>
          <PrimaryButton type="submit" inProgress={submitInProgress} disabled={submitDisabled}>
            {inProgress ? (
              <FormattedMessage id="EmailVerificationForm.verifying" />
            ) : (
              <FormattedMessage id="EmailVerificationForm.verify" />
            )}
          </PrimaryButton>
        </div>
      </Form>
    </div>
  );

  const alreadyVerified = (
    <div className={css.root}>
      <div>
        <IconEmailSuccess className={css.modalIcon} />
        <h1 className={css.modalTitle}>
          <FormattedMessage id="EmailVerificationForm.successTitle" values={{ name }} />
        </h1>

        <p className={css.modalMessage}>
          <FormattedMessage id="EmailVerificationForm.successText" />
        </p>
      </div>

      <div className={css.bottomWrapper}>
        <NamedLink className={css.submitButton} name="LandingPage">
          <FormattedMessage id="EmailVerificationForm.successButtonText" />
        </NamedLink>
      </div>
    </div>
  );

  return emailVerified && !pendingEmail ? alreadyVerified : verifyEmail;
};

EmailVerificationFormComponent.defaultProps = {
  currentUser: null,
  inProgress: false,
  verificationError: null,
};

const { bool } = PropTypes;

EmailVerificationFormComponent.propTypes = {
  ...formPropTypes,
  inProgress: bool,
  currentUser: propTypes.currentUser.isRequired,
  verificationError: propTypes.error,
};

const defaultFormName = 'EmailVerificationForm';

const EmailVerificationForm = compose(reduxForm({ form: defaultFormName }), injectIntl)(
  EmailVerificationFormComponent
);

export default EmailVerificationForm;
