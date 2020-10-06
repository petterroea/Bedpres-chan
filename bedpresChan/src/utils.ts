export const onlinewebV2UrlFromV1 = (url: string) => {
    const trimmed = url.substring(0,url.length-1)
	return trimmed.substring(0, trimmed.lastIndexOf('/')+1 )
}

export const parseOwDateString = (dateString: string) => {
	return new Date(Date.parse(dateString))
}

export const wait = (duration: number): Promise<void> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve()
		}, duration)
	})
}