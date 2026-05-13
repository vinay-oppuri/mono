import { createTRPCRouter } from '../init';
import { agentsRouter } from '@/modules/agents/server/procedures';
import { chatsRouter } from '@/modules/chats/server/procedures';
import { premiumRouter } from '@/modules/premium/server/procedures';
export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  chats: chatsRouter,
  premium: premiumRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
