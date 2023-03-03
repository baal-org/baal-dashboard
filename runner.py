import argparse

import uvicorn


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--debug", action="store_true")
    parser.add_argument("--port", default=8000)
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()

    kwargs = dict(
        app="baal_dashboard.app:app",
        host="0.0.0.0",
        port=int(args.port),
        reload=args.debug,
        workers=1,
        reload_dirs=["baal_dashboard"],
    )

    uvicorn.run(**kwargs)
