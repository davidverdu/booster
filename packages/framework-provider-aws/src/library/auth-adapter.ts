import { CognitoUserPoolEvent } from 'aws-lambda'
import { UserEnvelope } from '@boostercloud/framework-types'
import { UserEnvelopeBuilder } from './user-envelopes'
import { CognitoIdentityServiceProvider } from 'aws-sdk'

export function rawSignUpDataToUserEnvelope(rawMessage: CognitoUserPoolEvent): UserEnvelope {
  return UserEnvelopeBuilder.fromAttributeMap(rawMessage.request.userAttributes)
}

export function userEnvelopeFromAuthToken(
  userPool: CognitoIdentityServiceProvider,
  token: string
): UserEnvelope | undefined {
  return undefined
}
