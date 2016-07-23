
def test_status_codes(instance, url, status, postData = {}, putData = {}, patchData = {}):
    """
    Test all methods (get, post, put, patch, delete) for given url
    Assert status code returned correspond to status one.
    instance : django rest framework ApiTestCase instance.
        must have a django rest framework APIClient intance
        as client (with login already done).
    url : url to be tested
    data : data used for post, put and patch requests
    status : a list with status codes, in order for:
        - get
        - post
        - put
        - patch
        - delete
    """
    # test with get
    response = instance.client.get(url)
    instance.assertEqual(response.status_code, status[0])
    
    # test with post
    response = instance.client.post(url, postData)
    instance.assertEqual(response.status_code, status[1])

    # test with put
    response = instance.client.put(url, putData)
    instance.assertEqual(response.status_code, status[2])

    # test with patch
    response = instance.client.patch(url, patchData)
    instance.assertEqual(response.status_code, status[3])
    
    # test with delete
    response = instance.client.delete(url)
    instance.assertEqual(response.status_code, status[4])
    
