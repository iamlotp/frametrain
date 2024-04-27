'use server'
import { dimensionsForRatio } from '@/sdk/constants'
import type { FrameActionPayload, FrameButtonMetadata } from '@/lib/farcaster'
import type { Config, State } from '..'
import PageView from '../views/Page'
import initial from './initial'

export default async function page(
    body: FrameActionPayload,
    config: Config,
    state: State,
    params: any
) {
    const nextPage =
        params?.currentPage !== undefined
            ? body.untrustedData.buttonIndex === 1
                ? Number(params?.currentPage) - 1
                : Number(params?.currentPage) + 1
            : 1

    const slideCount = config.slideUrls.length

    const buttons: FrameButtonMetadata[] = [
        {
            label: '←',
        },
    ]

    if (nextPage < slideCount) {
        buttons.push({
            label: '→',
        })
    }

    if (body.untrustedData.buttonIndex === 2 && nextPage === slideCount) {
        buttons.push({
            label: 'Create Your Own',
            action: 'link',
            target: 'https://frametra.in',
        })
    }

    let frame

    if (body.untrustedData.buttonIndex === 1 && nextPage === 0) {
        return initial(config, state)
    }
	
	const slideUrl = config.slideUrls[nextPage - 1]
	
	return {
		buttons: buttons,
		aspectRatio: config?.aspectRatio?.replace('/', ':') ?? '1:1',
		component: PageView({
			slideUrl: slideUrl,
			sizes: dimensionsForRatio[config.aspectRatio as keyof typeof dimensionsForRatio],
		}),
		functionName: 'page',
		params: {
			currentPage: nextPage,
		},
	}
  
}
