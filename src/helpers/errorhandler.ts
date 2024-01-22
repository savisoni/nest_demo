import { HttpException, HttpStatus } from "@nestjs/common";

export function handleCatchError(error) {
    console.log("error=====>", error);
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }