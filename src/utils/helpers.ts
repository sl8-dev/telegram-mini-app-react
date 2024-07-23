import { GraphQLError } from 'graphql/error';
import { User } from '@tma.js/sdk-react';
import { DisplayDataRow } from '@/components/DisplayData/DisplayData.tsx';

export function transformInitData(initData: string): string {
  if (!initData) {
    return '';
  }

  const data = Object.fromEntries(new URLSearchParams(initData));

  return Object.keys(data)
    .filter((key) => key !== 'hash')
    .map((key) => `${key}=${data[key]}`)
    .sort()
    .join('\n');
}

export function isGraphqlError(
  error: any, // TODO: Fix this type.
  errorSlug?: string,
) {
  if (!errorSlug) {
    return error?.graphQLErrors?.find(
      (
        _error: GraphQLError, // TODO: use underscore _ in beginning of variable name that are not used.
      ) => true,
    );
  }

  return error?.graphQLErrors?.find((e: GraphQLError) => {
    return e.extensions.code === errorSlug;
  });
}

export function getUserRows(user: User): DisplayDataRow[] {
  return [
    { title: 'id', value: user.id.toString() },
    { title: 'username', value: user.username },
    { title: 'photo_url', value: user.photoUrl },
    { title: 'last_name', value: user.lastName },
    { title: 'first_name', value: user.firstName },
    { title: 'is_bot', value: user.isBot },
    { title: 'is_premium', value: user.isPremium },
    { title: 'language_code', value: user.languageCode },
    { title: 'allows_to_write_to_pm', value: user.allowsWriteToPm },
    { title: 'added_to_attachment_menu', value: user.addedToAttachmentMenu },
  ];
}
