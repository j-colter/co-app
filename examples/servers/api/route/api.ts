import { GET, Path, PathParam } from '@colter/typescript-rest';
import { Response, Tags } from '@colter/typescript-rest-swagger';

@Path('/api')
@Tags('用户接口')
export default class ApiController {
  @Path(':id')
  @GET
  @Response<{ code: number }>('indexResponse')
  async index(@PathParam('id') id: number) {
    // await new Promise((resolve) => {
    //   setTimeout(() => resolve(null), 800);
    // });
    console.log('api index', id);

    return { code: 1 };
  }
}
