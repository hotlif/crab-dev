import axios from "axios";
import JSEncrypt from "jsencrypt";

const RSA_PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAg5mHOvjOgVOKTbKa65NS4SCL0OXICC7TGtHSqefnOIdYXLIFipDt2WmQWvidbKmw8oQmxveinyG4ZPjpyokPjay/IrxBwf87xjZUzaEqWf21/tsvAl3SEebSW5sbfS1PMTaSIV+rciOf4WOsqLRJSkeFs5q8xoHzDTxRoRDBSQR0XD5xf7VZgaRRNXbf71aBDh/vqrzgm1HSAyKTlNsohO4kkX5FrWyon3dFhIQFlkO17b+2EUVm1G8JiP6CcsXdWwQhcczQDcTjdHJYvDXRMrf4Q0qimRCMtsWCxkfoiYDQU9G/+LA6Kjnlg7ksUQZGE1A8sdye60Oqk8CWrcMahQIDAQAB";

const encrypt = new JSEncrypt();
encrypt.setPublicKey(RSA_PUBLIC_KEY);

interface FileUploadComponentResponseType {
    FileName: string
    FileId: string
    Md5: string
    Length: number
    UploadDateTime: string
    PdfId: null
    Type: number
    Url: unknown
}

interface LoginResponseType {
    State: number
    AccessToken: string
    RefreshToken: string
    SubDomain: string
    Message: unknown
    ExUserId: string
    ExDingTalkId: string
}

interface Response<T> {
    Code: number
    Status: number
    ExceptionSeqNo: unknown
    MessageShowType: unknown
    Message: string
    Result: T
}

interface ComponentAddOrUpdateRequest {
    Color: string
    ComponentConfig: {
        globalInputParams: unknown[]
        useInputParams: unknown[]
        useOutputParams: unknown[]
    }
    ComponentFile: unknown
    ComponentName: string
    Icon: string
    IsUploadIcon: number
    MobileComponentFile: unknown
    Name: string
    Tag: string
    TagTemp: unknown[]
    VersionId: unknown
}

class LcpWebSdk {
    private instance;
    private userId: string = "";
    private token: string = "";
    constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                AuthType: 1,
                DeviceType: 1,
                TnCode: "00000000",
                Authorization: this.token && this.token !== "" ? this.token : undefined
            }
        })
    }

    async login(param: {
        tenantCode: string, username: string, password: string
    }): Promise<Response<LoginResponseType>> {
        const res = await this.instance.post("/api/UserInfo/GetUseStateForLogin", {
            Code: param.username,
            Password: encrypt.encrypt(param.password),
            TenantCode: param.tenantCode
        });

        if (res.data?.AccessToken) {
            const userInfo = JSON.parse(Buffer.from(res.data.AccessToken.split(".")[1], 'base64').toString());
            this.userId = userInfo.UserId;
            this.token = res.data?.AccessToken;
        }
        return res.data;
    }

    async componentFileUpload(file: Blob): Promise<Response<FileUploadComponentResponseType>> {
        const formData = new FormData();
        formData.append("file", file);
        const res =  await this.instance.post("/api/ComponentManager/FileUploadComponent", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "UserId": this.userId
            }
        })
        return res.data;
    }

    async componentAddOrUpdate(param: ComponentAddOrUpdateRequest) {
        const res = await this.instance.post("/api/ComponentManager/AddorUpdate", param, {
            headers: {
                "UserId": this.userId
            }
        })
        return res.data;
    }
}

export default LcpWebSdk;
