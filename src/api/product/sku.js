import request from '@/utils/request'

export function getListData(query, page = 1, size = 10) {
    return request({
        url: '/sku/list',
        method: 'post',
        data: {
            ...query,
            page,
            size
        }
    })
}

export function addSku(data) {
    return request({
        url: '/sku/add',
        method: 'post',
        data
    })
}

export function deleteSku(data) {
    return request({
        url: '/sku/delete',
        method: 'post',
        data
    })
}

export function findSku(data) {
    return request({
        url: '/sku/find',
        method: 'post',
        data
    })
}

export function editSku(data) {
    return request({
        url: '/sku/edit',
        method: 'post',
        data
    })
}


export function getAllSkuType() {
    return request({
        url: '/skuType/findAll',
        method: 'post'
    })
}