import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    // Generate authentication parameters
    const authenticationParameters = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
    });

    // Return the parameters in the expected format
    return Response.json({
      signature: authenticationParameters.signature,
      expire: authenticationParameters.expire,
      token: authenticationParameters.token,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
    });
  } catch (error) {
    console.error("ImageKit authentication error:", error);
    return Response.json(
      {
        error: "Authentication for Imagekit failed",
      },
      { status: 500 }
    );
  }
}