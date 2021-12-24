import request from '@/utils/request'

export function getListData(query, page = 1, size = 10) {
    return request({
        url: '/skuType/list',
        method: 'post',
        data: {
            ...query,
            page,
            size
        }
    })
}

export function addSkuType(data) {
    return request({
        url: '/skuType/add',
        method: 'post',
        data
    })
}

export function deleteSkuType(data) {
    return request({
        url: '/skuType/delete',
        method: 'post',
        data
    })
}

export function findSkuType(data) {
    return request({
        url: '/skuType/find',
        method: 'post',
        data
    })
}

export function editSkuType(data) {
    return request({
        url: '/skuType/edit',
        method: 'post',
        data
    })
}