import { GeneralRequestOptions } from '../interfaces/generals';
import { OverlappingProps } from '../interfaces/generals';

export const isOverlappingFragment = ({
  startIndex,
  length,
  allSelections,
}: OverlappingProps): boolean => {
  const endIndex = startIndex + length;
  return allSelections.some(({ startIndex: selStart, length: selLength }) => {
    const selEnd = selStart + selLength;
    return startIndex < selEnd && endIndex > selStart;
  });
};

export const generalRequest = async (
  url: string,
  method: string = 'GET',
  options: GeneralRequestOptions = {}
) => {
  try {
    const { headers, body } = options;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/${url}/`, {
      method,
      headers,
      body,
    });

    const data = await res.json();

    return {
      data,
      status: res.status,
      error: false,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        message: error.message,
        error: true,
        data: error,
      };
    } else {
      return {
        message: 'Unknown error occurred',
        error: true,
        data: error,
      };
    }
  }
};
