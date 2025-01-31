import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import moment from "moment"

import { ApiContext } from "@/utils/api"

import MetaHeader from "@/components/MetaHeader"
import PageOverlay from "@/components/PageOverlay"
import PageTitle from "@/components/PageTitle"
import { getQs } from "@/utils/qs"

export default function Namespace() {
  const router = useRouter()
  const api = React.useContext(ApiContext)
  const [data, setData] = React.useState<any>(null)

  React.useEffect(() => {
    if (!api.url || !router.isReady) return
    api.instance
      .get(`/namespaces/${router.query.name}/inspect`)
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        // Todo: Handle error
        console.error(err)
      })
  }, [api.url, api.instance, router.isReady, router.query.name, setData])

  return (
    <>
      <MetaHeader title={`Namespace ${getQs(router.query.name) || ""}`} />
      <PageOverlay>
        <PageTitle title={`Namespace ${getQs(router.query.name) || ""}`} />
        <div className="ml-2 flex flex-col">
          <div className="flex flex-col">
            <div className="mb-2">
              <p>Created at</p>
              <p className="text-sm text-gray-500">
                {data?.Network?.Created
                  ? moment
                      .parseZone(data?.Network?.Created)
                      .format("DD/MM/YYYY HH:mm:ss")
                  : "N/A"}
              </p>
            </div>
            <div className="mb-2">
              <p>Scope</p>
              <p className="text-sm text-gray-500">
                {data?.Network?.Scope || "N/A"}
              </p>
            </div>
            <div className="mb-2">
              <p>Driver</p>
              <p className="text-sm text-gray-500">
                {data?.Network?.Driver || "N/A"}
              </p>
            </div>
            <div className="mb-2">
              <p>Gateway</p>
              <p className="text-sm text-gray-500">
                {data?.Network?.IPAM?.Config
                  ? data?.Network.IPAM.Config[0].Gateway
                  : "N/A"}
              </p>
            </div>
            <div className="mb-2">
              <p>Subnet</p>
              <p className="text-sm text-gray-500">
                {data?.Network?.IPAM?.Config
                  ? data?.Network.IPAM.Config[0].Subnet
                  : "N/A"}
              </p>
            </div>
            <div className="mb-2">
              <Link
                className="text-[var(--ifm-color-primary)]"
                href={`/cargoes?Namespace=${router.query.name}`}
              >
                Cargoes
              </Link>
              <p className="text-sm text-gray-500">
                {data?.Cargoes?.length ? data?.Cargoes.length : "N/A"}
              </p>
            </div>
            <div className="mb-2">
              <p>Instances</p>
              <p className="text-sm text-gray-500">
                {data?.Network?.Containers
                  ? Object.values(data.Network.Containers).length
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </PageOverlay>
    </>
  )
}
