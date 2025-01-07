import { ApiEndpoint } from '@/types/apiEndpoint'

export const endpoints: ApiEndpoint[] = [
  {
    id: 'new-equipment',
    name: 'New Equipment',
    method: 'POST',
    url: 'http://api.onenet.hk.chinamobile.com/devices',
    defaultBody: {
      title: '',
      desc: '',
      tags: [],
      location: {
        lon: null,
        lat: null,
      },
      private: true,
      auth_info: '',
      other: {
        version: '',
        manufacturer: '',
      },
    },
  },
  {
    id: 'update-equipment',
    name: 'Update Equipment',
    method: 'PUT',
    url: 'http://api.onenet.hk.chinamobile.com/devices/',
    defaultBody: {
      title: '',
      desc: '',
      tags: [],
      location: {
        lon: null,
        lat: null,
      },
      private: true,
      auth_info: '',
      other: {
        version: '',
        manufacturer: '',
      },
    },
  },
]
