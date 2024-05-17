import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseAndUser, getDb } from '@/app/lib/utils/db';
import { sendErrorResponse } from '@/app/lib/utils/response';
import OpenAI from 'openai';

const openai = new OpenAI();

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const db = await getDb();
    const userEmail = req.headers.get('userEmail') as string;
    const serviceName = req.headers.get('serviceName');
    const { user } = await getDatabaseAndUser(db, userEmail);

    if (serviceName === 'assistant' && user.assistantId) {
      const [assistant, thread, fileList] = await Promise.all([
        openai.beta.assistants.retrieve(user.assistantId),
        openai.beta.threads.retrieve(user.threadId as string),
        openai.beta.assistants.files.list(user.assistantId),
      ]);

      const filesWithNames = await Promise.all(
        fileList.data.map(async (fileObject) => {
          const file = await openai.files.retrieve(fileObject.id);
          return {
            id: fileObject.id,
            name: file.filename,
            assistantId: user.assistantId,
          };
        })
      );

      return NextResponse.json({
        message: 'Assistant retrieved',
        assistant,
        threadId: thread?.id,
        fileList: filesWithNames,
        isAssistantEnabled: user.isAssistantEnabled,
        status: 200,
      });
    }

    return NextResponse.json({
      message: 'Assistant cannot be retrieved, as it has not been created',
      status: 200,
    });
  } catch (error: any) {
    console.error('Assistant retrieval unsuccessful', error);
    return sendErrorResponse('Assistant retrieval unsuccessful', 400);
  }
}
